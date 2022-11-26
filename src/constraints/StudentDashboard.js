import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BuildIcon from '@mui/icons-material/Build';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WebhookIcon from '@mui/icons-material/Webhook';
import SchoolIcon from '@mui/icons-material/School';
export const DASHBOARD_TEACHER = [
    
    {
        id: 9,
        icon: WebhookIcon,
        text: 'Tổng quan hệ thống',
        link: 'summary',
        list: ['summary'],
    },
    {
        id: 10,
        icon: ManageAccountsIcon,
        text: 'Tổng quan người dùng',
        link: 'summary-user',
        list: ['summary-user'],
    },
    {
        id: 3,
        icon: BuildIcon,
        text: 'Phân quyền người dùng',
        link: 'manage-user',
        list: ['manage-user'],
    },
    {
        id: 2,
        icon: SchoolIcon,
        text: 'Danh sách khoá học',
        link: 'manage-course',
        list: ['manage-course','create-course'],
    },
   
    {
        id: 7,
        icon: ListAltIcon,
        text: 'Danh sách lượt thi',
        link: 'manage-takeexam',
        list: ['manage-takeexam'],
    },
   
    {
        id: 5,
        icon: CreditCardIcon,
        text: 'Quản lý thanh toán',
        link: 'manage-bill',
        list: ['manage-bill']
    },
    {
        id: 1,
        icon: PersonIcon,
        text: 'Thông tin tài khoản',
        link: 'profile',
        list: ['profile'],
    },
]
export const SIDEBAR_COURSE_TEACHER = [
    
    {
        id: 1,
        icon: NotificationsIcon,
        text: 'Danh sách đề thi',
        link: 'manage-exam',
        list:[
            'manage-exam',
            'create-exam',
            'edit-exam',
            'detail-exam',
        ]
    },
    {
        id: 2,
        icon: PersonIcon,
        text: 'Danh sách học viên',
        link: 'manage-student',
        list: ['manage-student'],
    },
    {
        id: 3,
        icon: ListAltIcon,
        text: 'Ngân hàng câu hỏi',
        link: 'question-bank',
        list: ['question-bank']
    },
    {
        id: 6,
        icon: FavoriteIcon,
        text: 'Thống kê',
        link: 'statistic',
        list: ['statistic'],
    }
    

]
export const SIDEBAR_COURSE_STUDENT = [
    
    {
        id: 1,
        icon: NotificationsIcon,
        text: 'Danh sách đề thi',
        link: 'manage-exam',
        list:[
            'manage-exam',
            'create-exam',
            'edit-exam',
            'detail-exam',
        ]
    },
    {
        id: 2,
        icon: PersonIcon,
        text: 'Danh sách học viên',
        link: 'manage-student',
        list: ['manage-student'],
    },
    {
        id: 6,
        icon: FavoriteIcon,
        text: 'Thống kê',
        link: 'statistic',
        list: ['statistic'],
    }
    

]
