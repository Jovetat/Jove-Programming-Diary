# ExcelJS 使用教程：动态导出 Excel 表格解决方案

## 功能简介

本教程实现了使用 `ExcelJS` 动态导出 Excel 表格的高级功能，包括：

- 在表头上方添加说明文字。
- 动态设置列宽，确保内容和表头完整显示，左右留取空白。
- 表格中所有字体设置为微软雅黑。
- 支持合计行功能，允许多行合计内容。
- 为表头和内容添加黑色边框，提高视觉效果。
- 表格整体样式优化，提升用户体验。

------

### 环境准备

#### 安装依赖

```
npm install exceljs file-saver ant-design-vue
```

#### 完整代码

```ts
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import message from 'ant-design-vue/es/message'

const borderStyle: any = {
  top: { style: 'thin', color: { argb: 'FF000000' } },
  left: { style: 'thin', color: { argb: 'FF000000' } },
  bottom: { style: 'thin', color: { argb: 'FF000000' } },
  right: { style: 'thin', color: { argb: 'FF000000' } },
}
const fontName = 'Microsoft YaHei'

export const exportExcel = async (
  columns: any[], // 表头
  tableData: any[], // 表格数据
  fileName: string, // 文件名
  summaryRows?: any[][], // 合计行（二维数组支持多行）
  headerNotes?: any[][], // 表格上方说明文字（二维数组支持多行）
) => {
  try {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(fileName)

    // 添加说明文字
    if (headerNotes && headerNotes.length > 0) {
      headerNotes.forEach((noteRow) => {
        const row = worksheet.addRow(noteRow)
        row.eachCell((cell) => {
          cell.font = { bold: true, size: 12, name: fontName } // 字号为12，加粗，微软雅黑
          cell.alignment = { horizontal: 'left', vertical: 'middle' } // 左对齐
        })
        row.height = 24 // 行高
      })
      worksheet.addRow([]) // 说明文字与表头之间空一行
    }

    // 添加表头
    const headerRowData = columns.map((col) => col.title)
    const headerRow = worksheet.addRow(headerRowData)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12, name: fontName } // 字号为12，加粗，微软雅黑
      cell.alignment = { horizontal: 'center', vertical: 'middle' } // 居中
      cell.border = {
        ...borderStyle,
      }
    })
    headerRow.height = 24 // 表头行高

    // 动态设置列宽
    columns.forEach((col, colIndex) => {
      const columnValues = [
        col.title,
        ...tableData.map((data) => data[col.dataIndex]),
      ]
      const maxLength = columnValues.reduce((max, value) => {
        const length = value ? value.toString().length : 0
        return Math.max(max, length)
      }, 0)

      // 设置宽度：基础宽度 + 比例调整
      worksheet.getColumn(colIndex + 1).width = maxLength * 2.4 + 2
    })

    // 添加表格数据
    tableData.forEach((data) => {
      const rowData = columns.map((col) => data[col.dataIndex])
      const row = worksheet.addRow(rowData)
      row.eachCell((cell) => {
        cell.font = { size: 12, name: fontName } // 字号为12，微软雅黑
        cell.alignment = { horizontal: 'center', vertical: 'middle' } // 居中
        cell.border = {
          ...borderStyle,
        }
      })
      row.height = 24 // 行高
    })

    // 添加合计行
    if (summaryRows && summaryRows.length > 0) {
      summaryRows.forEach((summaryRow) => {
        const row = worksheet.addRow(summaryRow)
        row.eachCell((cell) => {
          cell.font = { size: 12, name: fontName } // 字号为12，微软雅黑
          cell.alignment = { horizontal: 'left', vertical: 'middle' } // 左对齐
        })
        row.height = 24 // 行高
      })
    }

    // 转为 Blob 并下载
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    saveAs(blob, `${fileName}.xlsx`)
  } catch (error: any) {
    console.error(error)
    message.error('导出表格失败:', error.message)
  }
}
```