// project import
import pages from './pages';
import dashboard from './dashboard';
import utilities from './utilities';
import support from './support';
import { HomeIcon } from 'components/icons';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    // items: [dashboard, pages, utilities, support]
    items: [
        {
            id: 'group-home',
            type: 'group',
            children: [
                {
                    id: 'home',
                    title: 'Home',
                    type: 'item',
                    url: '/',
                    icon: HomeIcon,
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default menuItems;
