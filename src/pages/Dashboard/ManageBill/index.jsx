import { useEffect, useState } from 'react'
import {
    Box,
    Stack,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    Paper,
    Button,
    Chip
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { TableHeadCustom, TableToolbar } from 'components/TableCustom';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx'
import moment from 'moment';
import apiAdmin from 'apis/apiAdmin';
import { numWithCommas } from 'utils';
import AppWidgetSummary from 'components/AppWidgetSummary';
import BarChartPoint from './component/BarChartPoint';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên người dùng', align: 'left' },
    { id: 'description', label: 'Mô tả', align: 'center' },
    { id: 'amount', label: 'Số tiền', align: 'center' },
    { id: 'createdAt', label: 'Thời gian', align: 'center' },
    { id: 'method', label: 'Phương thức', align: 'center' },
    { id: 'status', label: 'Trạng thái', align: 'center' },
    { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const ListExaminationTeacher = () => {
    document.title = "Quản lý thanh toán"
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [bills, setBills] = useState([])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bills.length) : 0;

    const filteredUsers = applySortFilter(bills, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    //Effect
    useEffect(() => {
        const loadListBill = () => {//lấy danh sách bài kiểm tra
            apiAdmin.getAllBill()
                .then(res => {
                    setBills(res)
                })
        }
        loadListBill()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const exportToCSV = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'Dữ liệu người dùng'
        
        let data = filteredUsers.map(item => {
            let { fullname, description, amount, status, method, createdAt  } = item
            
            return {
                'Họ và tên': fullname,
                'Mô tả': description,
                'Số tiền': amount,
                'Phương thức': method,
                'Trạng thái': status === 'success'?'Thành công':'Thất bại',
                'Ngày tạo': moment(createdAt).format('DD-MM-YYYY')
            }
        })
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    const ButtonExportFile = () => {
        return (
            <Button variant='outlined' onClick={exportToCSV}>
                Xuất File Excel
            </Button>
        )
    }

    const count = bills.length
    const sumAmount = bills.reduce((total, cur) => {
        if(cur.status === 'success')
            return total + Number(cur.amount)
        return total
    },0)

    const series = (()=>{
        let data = []
        for(let i=1;i<=15;i++){
            let curDate = moment().subtract(i,'days').toISOString().substring(0,10)
            let arr = bills.filter(e=>e.createdAt?.indexOf(curDate)>=0)
            let amount = arr.reduce((total,cur)=>cur.status === 'success'?total+Number(cur.amount):total,0)
            data.push({
                label:curDate,
                amount,
                count:arr.length
            })
        }
        return data
    })()

    return (
        <Box >
            <Stack spacing={2}>
                <Grid container spacing={2} justifyContent='center'>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượt thanh toán" total={count} icon={'ant-design:android-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Tổng số doanh thu" total={sumAmount} color="info" icon={'ant-design:apple-filled'} />
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng bài thi" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng bài tập" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid> */}
                </Grid>

                <Paper>
                    <BarChartPoint seriesData={series}/>
                </Paper>

            
                <Paper elevation={24}>
                    <TableToolbar ButtonCustom={ButtonExportFile} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800, padding: '0 12px' }}>
                            <Table>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={bills.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, name, description, amount, status, method, createdAt } = row;

                                        return (
                                            <TableRow
                                                hover
                                                key={id}
                                                tabIndex={-1}
                                            >

                                                <TableCell align="left">{name}</TableCell>
                                                <TableCell align="center">{description}</TableCell>
                                                <TableCell align="center">{numWithCommas(amount)}đ</TableCell>
                                                <TableCell align="center">{moment(createdAt).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell align="center">{method}</TableCell>
                                                <TableCell align="center">
                                                    <Chip size="small"
                                                        color={(status === 'success' && 'success') || 'warning'}
                                                        label={status === 'success' ? 'Thành công' : 'Thất bại'}
                                                    />
                                                </TableCell>
                                                {/* <TableCell align="right">
                                                    <UserMoreMenu id={idUser} />
                                                </TableCell> */}
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        labelRowsPerPage='Số dòng mỗi trang'
                        count={bills.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Stack>
        </Box>
    )
}



export default ListExaminationTeacher