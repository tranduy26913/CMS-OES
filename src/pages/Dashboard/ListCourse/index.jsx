import { useState, useEffect } from 'react'
import {
    Box,
    Card,
    Button,
    CardMedia,
    Stack,
    Typography,
    Paper,
    Divider,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    Avatar,
    Chip,
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';
import AppWidgetSummary from 'components/AppWidgetSummary';
import apiAdmin from 'apis/apiAdmin';
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { TableHeadCustom, TableToolbar } from 'components/TableCustom';
import moment from 'moment';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx'
import { useDispatch, useSelector } from 'react-redux';
import { setListUser } from 'slices/userSlice';
import Page from 'components/Page';
import ButtonExport from 'components/ButtonExport';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên khoá học', align: 'left' },
    { id: 'exams', label: 'Số bài thi', align: 'center' },
    { id: 'assignments', label: 'Số bài tập', align: 'center' },
    { id: 'students', label: 'Số học viên', align: 'center' },
    { id: 'status', label: 'Trạng thái', align: 'center' },
    // { id: '', label: 'Thao tác', align: 'right' },
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
        return array.filter((_user) => _user.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
const ListCourse = () => {
    const [courses, setCourses] = useState([])
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    useEffect(() => {
        const getData = () => {

            apiAdmin.getAllCourses()
                .then(res => {
                    setCourses(res)

                })
        }
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0;

    const filteredCourses = applySortFilter(courses, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredCourses.length === 0;

    const dataExport = () => {

        return filteredCourses.map(item => {
            const { id: courseId, name, assignments, exams, students, status } = item;

            return {
                'Tên khoá học': name,
                'Số bài thi': exams.length,
                'Số bài tập': assignments.length,
                'Số học viên': students.length,
                'Trạng thái': status === 'private' ? 'Riêng tư' : 'Công khai',

            }
        })
    }

    const ButtonExportFile = () => {
        return (
            <ButtonExport variant='outlined' dataExport={dataExport()}>
            </ButtonExport>
        )
    }
    const numberOfExams = courses.reduce((total, cur) => total + (cur?.exams?.length || 0), 0)
    const numberOfAssignments = courses.reduce((total, cur) => total + (cur?.assignments?.length || 0), 0)

    return (
        <Page title='Danh sách khoá học'>

            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng khoá học" total={courses.length} icon={'ant-design:android-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng bài thi" total={numberOfExams} color="info" icon={'ant-design:apple-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng bài tập" total={numberOfAssignments} color="warning" icon={'ant-design:windows-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượt thi" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid>
                </Grid>
                {/* <Paper elevation={24}>
                    <Stack direction='row' justifyContent={'flex-end'} p={1.5}>
                        <Link to='/my/list-course/create-course'>
                            <Button variant='outlined'>Tạo khoá học</Button>
                        </Link>
                    </Stack>
                    <Divider></Divider>
                    <Grid container spacing={2} p={1.5}>
                        {
                            courses.map(item =>
                                <Grid key={item.id} lg={3} md={3} xs={6}>
                                    <Card className='hover-element' sx={{ maxWidth: 345, border: "1px solid #00e67660" }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            width="180"
                                            image={item.image}
                                            alt="green iguana"
                                        />
                                        <Typography color="primary" variant="h5" component="div"
                                            sx={{
                                                textAlign: "center"
                                            }}>
                                            {item.name}
                                        </Typography>
                                        <Stack
                                            p='0.5rem 1rem'
                                            direction='row'
                                            justifyContent="center"
                                            spacing={2}>
                                            <Link to={`/course/${item.courseId}`}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    endIcon={<AssignmentIcon />}
                                                >Chi tiết</Button>
                                            </Link>
                                            <Button variant="outlined" size="small"
                                                endIcon={<SendIcon />}>Chia sẻ</Button>
                                        </Stack>
                                    </Card>
                                </Grid>)
                        }
                    </Grid>
                </Paper> */}
                <Paper elevation={24}>
                    <TableToolbar
                        ButtonCustom={ButtonExportFile}
                        filterName={filterName} onFilterName={handleFilterByName} />
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800, padding: '0 12px' }}>
                            <Table>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={courses.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id: courseId, name, assignments, exams, students, status } = row;

                                        return (
                                            <TableRow
                                                hover
                                                key={courseId}
                                                tabIndex={-1}
                                            >
                                                <TableCell sx={{ width: '20%' }} align="left">
                                                    {name}
                                                </TableCell>
                                                <TableCell align="center">{exams.length}</TableCell>
                                                <TableCell align="center">{assignments.length}</TableCell>
                                                {/* <TableCell align="center">{moment(birthday).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell align="center">{gender === 'male' ? 'Nam' : 'Nữ'}</TableCell> */}

                                                <TableCell align="center">
                                                    {students.length}
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Chip label={status === 'private' ? 'Riêng tư' : 'Công khai'}
                                                        color={status === 'private' ? 'waring' : 'primary'}>

                                                    </Chip>
                                                </TableCell>
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
                        count={courses.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Stack>
        </Page>
    )
}

export default ListCourse