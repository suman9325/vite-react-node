import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Routes } from 'react-router-dom';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { pageRoutes } from './pageRoutes';
import Loader from './components/Loader/Loader';

const drawerWidth = 260;

function AppSidebar(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1E293B',
                color: '#fff',
            }}
        >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <DashboardIcon sx={{ color: '#38BDF8', fontSize: 32, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    My Dashboard
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: '#4B5563' }} />
            <List sx={{ flexGrow: 1, p: 2 }}>
                {pageRoutes.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            sx={{
                                borderRadius: 2,
                                '&:hover': { backgroundColor: '#334155' }
                            }}
                        >
                            <ListItemIcon sx={{ color: '#38BDF8' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ borderColor: '#4B5563' }} />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <CssBaseline />
            {/* FIXED APP BAR */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: '#1E293B',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }, // Fix width for sidebar
                    ml: { sm: `${drawerWidth}px` }, // Prevent overlapping with sidebar
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 0, mr: 'auto' }}>
                        My App
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" sx={{ ml: 2 }}>
                        <Avatar>SK</Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* SIDEBAR DRAWER */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { width: drawerWidth, backgroundColor: '#1E293B', color: '#fff' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            height: '100vh', // Ensure it matches screen height
                            backgroundColor: '#1E293B',
                            color: '#fff',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    height: '80vh', // Ensures it takes full height minus top spacing
                    overflowX: 'hidden', // Prevent horizontal scroll
                    overflowY: 'auto', // Only scroll if content overflows
                    backgroundColor: '#F8FBFC',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '60px',
                }}
            >
                <Toolbar />
                <React.Suspense fallback={<Loader visible={true} />}>
                    <Routes>
                        {pageRoutes.map(({ path, element: Component }) => (
                            <Route key={path} path={path} element={<Component />} />
                        ))}
                    </Routes>
                </React.Suspense>
            </Box>
        </Box>
    );
}

AppSidebar.propTypes = {
    window: PropTypes.func,
};

export default AppSidebar;
