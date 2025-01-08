# 通过XLSX导出Excel表格

## 安装 `xlsx` 库：

```
npm install xlsx
```

## 示例代码

```ts
import * as XLSX from 'xlsx'
import message from 'ant-design-vue/es/message'

export const exportExcel = (
  columns: any[],
  tableData: any[],
  fileName: string,
  summaryRow?: any, // 合计的数据对象
) => {
  try {
    // 获取表头
    const headers = columns.map((col) => col.title)

    // 获取表格数据
    let data = tableData.map((row) => {
      return columns.map((col, index) =>
        col?.customRender
          ? col.customRender({
              text: row[col.dataIndex],
              index,
              record: row,
              column: col,
            })
          : row[col.dataIndex],
      )
    })
    // 添加合计行
    if (summaryRow) {
      data.push(summaryRow)
    }

    // 合并表头和数据
    const sheetData = [headers, ...data]

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(sheetData)

    // 设置列宽
    ws['!cols'] = columns.map((col, index) => {
      const headerLength = headers[index].length // 表头长度
      const maxLength = Math.max(
        ...sheetData.map((row) => (row[index] ? String(row[index]).length : 0)),
      )
      const width = Math.max(headerLength, maxLength) * 2 + 2 // +2 以增加一些间距
      return { wch: width }
    })

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, fileName)

    // 导出
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  } catch (error: any) {
    console.error(error)
    message.error('导出表格失败:', error.message)
  }
}
```

