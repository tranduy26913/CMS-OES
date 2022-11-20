import { useEffect, useState } from 'react'
import {
    Stack,
    Button,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    Avatar,
    Typography,
} from "@mui/material"
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { TableHeadCustom, TableToolbar } from 'components/TableCustom';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import apiAdmin from 'apis/apiAdmin';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx'


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'fullname', label: 'Tên người dùng', align: 'left' },
    { id: 'email', label: 'Email', align: 'center' },
    { id: 'birthday', label: 'Ngày sinh', align: 'center' },
    { id: 'gender', label: 'Giới tính', align: 'center' },
    { id: 'phone', label: 'Điện thoại', align: 'center' },
    { id: 'address', label: 'Địa chỉ', align: 'center' },
    { id: 'school', label: 'Trường học', align: 'center' },
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
        return array.filter((_user) => _user.fullname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const TableStudent = () => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [exams, setExams] = useState(samples)
    const { slug } = useParams()//lấy slug exam
    const role = useSelector(state => state.setting.role)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => setPage(newPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => setFilterName(event.target.value);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - exams.length) : 0;

    const filteredUsers = applySortFilter(exams, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    useEffect(() => {
        const getStatistic = () => {
            apiAdmin.getAllUser().then(res => {
                setExams(res)
            })
        }
        //getStatistic()
    }, [role, slug])
    const exportToCSV = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'Dữ liệu người dùng'
        const listRole = {
            TEACHER: 'Giáo viên',
            STUDENT: 'Học viên',
            ADMIN: 'Admin',
        }
        const listStatus = {
            active: 'Kích hoạt',
            inactive: 'Chưa kích hoạt',
            deleted: 'Đã xoá',
            lock: 'Đã khoá'
        }
        let data = filteredUsers.map(item => {
            let { fullname, email, birthday, status, gender, role, premium } = item

            return {
                'Họ và tên': fullname,
                'Email': email,
                'Ngày sinh': moment(birthday).format('DD-MM-YYYY'),
                'Giới tính': gender === 'male' ? 'Nam' : 'Nữ',
                'Trạng thái': listStatus[status],
                'Quyền hạn': listRole[role],
                'Cấp độ': premium ? "PREMIUM" : 'FREE'
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

    return (

        <Stack>
            <TableToolbar filterName={filterName} onFilterName={handleFilterByName} ButtonCustom={ButtonExportFile}
            />

            <Scrollbar>
                <TableContainer sx={{ minWidth: 800, padding: '0 12px' }}>
                    <Table>
                        <TableHeadCustom
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={exams.length}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                const { id: idUser, avatar, fullname, email, birthday, status, gender, address, school, phone, role, premium } = row;

                                return (
                                    <TableRow
                                        hover
                                        key={idUser}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left">
                                            <Stack direction='row' alignItems='center' spacing={1}>

                                                <Avatar alt={fullname} src={avatar} />
                                                <Typography>
                                                    {fullname}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">{email}</TableCell>
                                        <TableCell align="center">{moment(birthday).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell align="center">{gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
                                        <TableCell align="center">{phone}</TableCell>
                                        <TableCell align="center">{address}</TableCell>
                                        <TableCell align="center">{school}</TableCell>

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
                count={exams.length}
                labelRowsPerPage='Số dòng mỗi trang'
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Stack>
    )
}


const samples = [
    {
        id: 1,
        fullname: 'Trần Duy',
        gender: 'male',
        birthday: new Date().toISOString(),
        role: 'TEACHER',
        premium: true,
        status: 'active'
    },
    {
        id: 1,
        fullname: 'Trần Duy',
        gender: 'male',
        birthday: new Date().toISOString(),
        role: 'STUDENT',
        premium: false,
        status: 'inactive'
    }
]


export default TableStudent