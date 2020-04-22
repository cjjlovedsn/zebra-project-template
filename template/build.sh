#! /bin/bash


# 打包文件名称定义
dist_file="./dist.tgz"
# 远程脚本文件定义
deploy_file="./deploy.sh"
# 输出目录
output_dir="dist"
# 远程服务器配置
SSH_CONFIG=""
# 远程服务器路径
remotePath=""
# 打包时忽略的文件
TAR_IGNORE="--exclude=**/*.map"
# 是否需强制打包
COMPRESS=0
# 入口参数分析
TEMP=`getopt -o hbmlr: --long help,build,map,log,remote:,path: -- "$@"`

trap "rm $dist_file $deploy_file; exit" SIGHUP SIGINT SIGTERM

  #这个脚本用于判断MAC下的getopt脚本为gnu-getopt
check_opt() {
  getopt --test
  if [ "$?" != "4" ];then
      brew -v > /dev/null
      if [ "$?" != "0" ];then
          echo 'Please install brew for Mac: ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"'
      fi
      echo 'Please install gnu-getopt for Mac: brew install gnu-getopt'
      exit 1
  fi
}

check_opt

show_usage()
{
  cat <<EOF
    [-h|--help]         帮助文档
    [-b|--build]        构建应用
    [-m|--map]          不忽略.map文件
    [-l|--log]          发布日志
    [-r|--remote]       ssh远程服务器地址
    [--path]            ssh远程服务器路径
    [-c]                在压缩文件已存在的情况下仍旧执行压缩命令
EOF
  exit 1
}

show_error() {
  cat <<EOF
   远程错误代码对照表

   code         description
    0           ok
    1           No such file or directory
    2           $dist_file not exists
    3           解压文件出错
EOF
}

error_handler() {
  if [ $? != 0 ]; then
    [ -n "$1" ] && echo -e "\033[31mERROR: $1 \033[0m\n"
    [ -n "$2" ] && show_usage
    exit 1
  fi
}

create_sh() {
  [ -f $deploy_file ] && rm -f $deploy_file;
  echo '#! /bin/bash' >> $deploy_file
  echo 'path=$(cd `dirname $0`; pwd);' >> $deploy_file
  echo "[ \"\$path\" != \"$1\" ] && echo \"error: 1\" && exit 1;" >> $deploy_file
  # 删除旧有的资源目录
  echo "[ -d \"./public/adms\" ] && rm -rf ./public/adms;" >> $deploy_file
  # 判断文件是否存在
  echo "[ ! -f \"$2\" ] && \"error: 2\" && exit 1;" >> $deploy_file
  # 解压
  echo "tar --no-same-owner -zxvf $2" >> $deploy_file
  echo "[ $? != 0 ] && \"error: 3\" && exit 1;" >> $deploy_file
  echo "[ -f $2 ] && rm -f $2;" >> $deploy_file
  echo "[ -f $deploy_file ] && rm -f $deploy_file;" >> $deploy_file
  echo "echo \"error: 0\" && exit 0;" >> $deploy_file
}

# 获取远程脚本输出的错误信息
get_code(){
  _get_error_code() {
    echo $1 | grep -Eo 'error: [0-9]' | grep -Eo '[0-9]'
  }
  local v=$(_get_error_code "$1")
  [[ "$v" =~ ^[0-9]+$ ]] && return $v;
  echo -e "\033[31mERROR: $1 \033[0m\n" && exit 1;
}

# 参数错误时退出
error_handler "unknown argument!" true

# 获取参数
eval set -- "$TEMP"

# 解析参数
while :
do
  [ -z "$1" ] && break;
  case "$1" in
    -h|--help)
      show_usage; exit 0
      ;;
    -l|--log)
      npm run release
      shift
      ;;
    -b|--build)
      npm run build
      error_handler "build error!"
      echo "编译代码完毕，准备打包请稍候..."
      shift
      ;;
    -r|--remote)
      SSH_CONFIG=$2;shift 2
      ;;
    --path)
      [ -z "$2" ] && exit 1
      remotePath=$2;shift 2
      ;;
    -m|--map)
      TAR_IGNORE=
      shift
      ;;
    -c)
      COMPRESS=1
      shift
      ;;
    --)
      shift
      ;;
    *)
      error_handler "unknown argument!" true
      ;;
  esac
done

# 创建用户文件
build_conf=".vscode/build"
[ ! -d ".vscode" ] && mkdir .vscode
[ ! -f "$build_conf" ] && touch $build_conf

# 获取配置信息
. $build_conf

[ "$SSH_CONFIG" = "" ] && read -p "请输入远程登录信息(root@*)：" SSH_CONFIG && echo -e "SSH_CONFIG=$SSH_CONFIG" >> $build_conf
[ "$remotePath" = "" ] && read -p "请输入远程服务器路径：" remotePath && echo -e "remotePath=$remotePath" >> $build_conf

# 判断dist目录是否存在，如果不存在则执行npm run build命令
# 此处会循环执行多次以确保能切换到输出目录中
declare -i i=0
while ((i < 2))
do
  let ++i;
  # cd到输出目录，如果成功则跳出循环
  cd $output_dir && break;
  # 否则执行npm命令打包项目代码
  echo -n "dist目录不存在，可能是未build项目或者配置不正确，是否尝试执行build命令？[Y/n]: ";
  read
  if [ -z "$REPLY" ]; then
    echo "choice Yes";
  else
    case $REPLY in
      y|Y|yes)
        echo "choice Yes";;
      n|no)
        echo -e "\033[31mERROR: 未找到dist目录! \033[0m\n" && exit 0;;
      *)
        echo -e "\033[31mERROR: error choice! \033[0m\n" && exit 1;;
    esac
  fi
  npm run build
  # 打包出错时退出
  error_handler "build error!"
done

_pwd=$(cd `dirname $0`; pwd)
[ ! $_pwd=~"$output_dir" ] && echo -e "\033[31mERROR: $output_dir目录未找到 \033[0m\n" && exit 1;

# 判断tgz文件是否存在，不存在或者有传-c参数则开始打包
if [ ! -f "$dist_file" ] || [ $COMPRESS == 1 ]; then
  tar -zcvf $dist_file $TAR_IGNORE *
  error_handler "压缩$dist_file时出错!"
  echo "打包资源完毕，准备上传..."
else
  echo "准备上传..."
fi

# 创建远程执行的shell文件
create_sh $remotePath $dist_file

# 上传代码包及shell脚本
scp $dist_file $deploy_file $SSH_CONFIG:$remotePath
error_handler "上传文件出错!"
echo "上传完毕，准备执行远程操作..."

# 远程执行脚本
result=`ssh -tt $SSH_CONFIG "cd $remotePath && sh $deploy_file"`;
get_code "$result"
[ $? != 0 ] && echo -e "\033[31mERROR: 远程脚本执行出错! 错误信息：[$result] \033[0m\n" && show_error && exit 1;

# 删除本地的打包文件和创建的远程脚本文件
rm -f $dist_file $deploy_file
echo "远程脚本执行正常，上线完毕"

exit 0
