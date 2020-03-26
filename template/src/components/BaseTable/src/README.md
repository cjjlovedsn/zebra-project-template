# Table 组件文档

组件需要 vue2.6.x 版本及 element-UI 2.6.3 以上

## Attributes

|        参数        |                                                                                             说明                                                                                              |      类型      | 可选值 |     默认值     |
| :----------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------: | :----: | :------------: |
|   value/v-model    |                                                                                            绑定值                                                                                             |     object     |   —    |       —        |
|      columns       |                                                                                  表格列配置,见`columns`配置                                                                                   |     array      |   —    |       —        |
|        data        |                                                                                            数据源                                                                                             |     array      |   —    |       —        |
|       total        |                                                                                          数据总条数                                                                                           |     number     |   —    |       0        |
|     empty-text     |                                                                                           占位文本                                                                                            |     string     |   —    |   短横线“-”    |
|   column-options   |                                                              表格列选项统一设置，具体键值参考 element-ui 的 table-column 的属性                                                               |     object     |   —    |       —        |
|    page-options    |                                                                           分页组件的配置, 见`paginationOptions`配置                                                                           |     object     |   —    |       —        |
|      loading       |                                                                                           加载状态                                                                                            |    boolean     |   —    |     false      |
| limit-table-height |                                                                            限制表格高度，启用时`max-height`不生效                                                                             |    boolean     |   —    |     false      |
|     max-height     |                                                                                         表格最大高度                                                                                          | number/string  |   —    |       —        |
|     pagination     |                                                                                         是否显示分页                                                                                          |    boolean     |   —    |      true      |
|  popover-options   |                                                                              提示框配置, 见`popoverOptions`配置                                                                               |     object     |   —    |       —        |
|    show-tooltip    |                                                               是否需要显示 tooltip, 需要搭配`content`或者具名插槽`content`使用                                                                |    boolean     |   —    |     false      |
|      content       |                                                                                        tooltip 的内容                                                                                         |     string     |   —    |       —        |
|    border-hide     |                                                                                           隐藏边框                                                                                            |    boolean     |   —    |     false      |
|    empty-value     |                                                                              空值表,默认的空值为: undefined null                                                                              |      any       |   —    |       —        |
|     filterable     |                                                                                        开启列筛选功能                                                                                         |    boolean     |   —    |     false      |
|     checkedAll     |                                                                                        默认显示全部列                                                                                         |    boolean     |   —    |      true      |
|   defaultChecked   |                                                                            默认选择的列，需要搭配 filterable 使用                                                                             |    boolean     |   —    |     false      |
|   selectionRows    | 被勾选的行，需要 type=selection 的列配合使用。可通过.sync 修饰符开启双向绑定。如需要在数据更新之后保留之前选中的数据需要使用 reserve-selection 和 row-key 属性，具体用法请参照 elementUI 文档 |     array      |   —    |       —        |
|    selectionKey    |                                               被勾选的行数据的 key，用于筛选出特定的值。在不启用此属性的情况下，selectionRows 返回的是对象数组                                                |     string     |   —    |       —        |
|       fitRow       |                                           添加空白行。值为 true 的时候将会以 page.size(默认 10) 属性的值为填充行数,fitRow 为数值的时候表示表格行数                                            | boolean/number |   —    |      true      |
|     noDataText     |                                                                                     没有数据时的提示文字                                                                                      |     string     |   —    | 没有更多数据了 |
|    loadingText     |                                                                                       加载时的提示文字                                                                                        |     string     |   —    | 数据加载中...  |

### Columns

|   参数    |                      说明                       |     类型     |    可选值     | 默认值 |
| :-------: | :---------------------------------------------: | :----------: | :-----------: | :----: |
|   label   |                   显示的标题                    |    string    |       —       |   —    |
|   prop    |               对应列内容的字段名                |    string    |       —       |   —    |
| slotName  |                 表格列插槽名称                  |    string    |       —       |   —    |
|    map    |                单元格内容映射表                 | array/object |       —       |   —    |
|  columns  |                   表格列配置                    |    array     |       —       |   —    |
| cellClass |                 单元格样式类名                  |    string    | Function(row) |   —    | — |
|    ...    | element-ui 库 table-column 组件上的属性都可添加 |      —       |       —       |   —    |

|   page    |      当前页       |  string  |   —    |     'page'      |
### PaginationOptions

|   参数    |       说明        |   类型   | 可选值 |     默认值      |
| :-------: | :---------------: | :------: | :----: | :-------------: |
| prevText  |    上翻页文字     |  string  |   —    |        —        |
| nextText  |    下翻页文字     |  string  |   —    |        —        |
| pageSizes | size 选择下拉配置 | number[] |   —    | [5, 10, 25, 50] |
|   page    |      当前页       |  string  |   —    |     'page'      |
|   size    |   每页显示条数    |  string  |   —    |     'size'      |

### PopoverOptions

|参数|说明|类型|可选值|默认值|
|slot|popover 插槽名称|string|—|—|
|:-:|:-:|:-:|:-:|:-:|
|...|element-ui 库 popover 组件上的属性都可添加|—|—|—|
