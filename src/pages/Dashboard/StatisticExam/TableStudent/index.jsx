import { useEffect, useState } from 'react'
import {
    Stack,
    Chip,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    Button,
} from "@mui/material"
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { TableHeadCustom, TableToolbar } from 'components/TableCustom';
import TakeExamAction from '../TakeExamAction';



// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên đề thi', align: 'left' },
    { id: 'na', label: 'Điểm', align: 'center' },
    { id: 'role', label: 'Lần thi', align: 'center' },
    { id: 'isVerified', label: 'Thời lượng', align: 'center' },
    { id: 'status', label: 'Thời gian nộp', align: 'center' },
    { id: 'status', label: 'Thao tác', align: 'right' },
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

const TableStudent = ({exams}) => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    //const [exams, setExams] = useState(tests)

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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tests.length) : 0;

    const filteredUsers = applySortFilter(tests, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;
    const ButtonExportFile = () => {
        return (
            <Button variant='outlined'>
                Xuất File Excel
            </Button>
        )
    }

    return (

        <Stack>
            <TableToolbar filterName={filterName} onFilterName={handleFilterByName}
                ButtonCustom={ButtonExportFile} />

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
                                const { id: takeExamId, slug: slugExam, name, submitTime, points, turns, duration } = row;

                                return (
                                    <TableRow
                                        hover
                                        key={takeExamId}
                                        tabIndex={-1}
                                    >

                                        <TableCell align="left">{name}</TableCell>
                                        <TableCell align="center">{points}</TableCell>
                                        <TableCell align="center">{turns}</TableCell>
                                        <TableCell align="center">{duration}</TableCell>
                                        <TableCell align="center">
                                            {submitTime}
                                        </TableCell>

                                        <TableCell align="right">
                                            <TakeExamAction takeExamId={takeExamId}/>
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
                count={tests.length}
                labelRowsPerPage='Số dòng mỗi trang'
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Stack>
    )
}

const tests = [
    {
        id: '1',
        name: "Bài kiểm tra số 1",
        submitTime: new Date().toLocaleString(),
        duration: 30,
        points: 10,
        turns: 10
    },
    {
        id: '2',
        name: "Bài kiểm tra số 2",
        submitTime: new Date().toLocaleString(),
        duration: 30,
        points: 10,
        turns: 10
    },
    {
        id: '3',
        name: "Bài kiểm tra số 3",
        submitTime: new Date().toLocaleString(),
        duration: 30,
        points: 10,
        turns: 10
    },
    {
        id: '4',
        name: "Bài kiểm tra số 3",
        submitTime: new Date().toLocaleString(),
        duration: 30,
        points: 10,
        turns: 10
    },
    {
        id: '5',
        name: "Bài kiểm tra số 3",
        submitTime: new Date().toLocaleString(),
        duration: 30,
        points: 10,
        turns: 10
    },
    {
        name: "Bài kiểm tra số 3",
        submitTime: new Date().toLocaleString(),
        duration: 30,
        points: 10,
        turns: 10
    }
]

export default TableStudent