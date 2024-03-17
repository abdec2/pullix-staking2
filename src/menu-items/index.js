// project import
import pages from './pages';
import dashboard from './dashboard';
import utilities from './utilities';
import support from './support';
import { HomeIcon, CompanyIcon, MarketsIcon, PLXIcon, PlatFormIcon, PromotionsIcon } from 'components/icons';

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
                    
                },
                {
                    id: 'markets',
                    title: 'Markets',
                    type: 'item',
                    url: '/markets',
                    icon: MarketsIcon,
                    breadcrumbs: false,
                    disabled: true
                },
                {
                    id: 'platform',
                    title: 'Platform',
                    type: 'item',
                    url: '/platform',
                    icon: PlatFormIcon,
                    breadcrumbs: false,
                    disabled: true
                },
                {
                    id: 'promotions',
                    title: 'Promotions',
                    type: 'item',
                    url: '/promotions',
                    icon: PromotionsIcon,
                    breadcrumbs: false,
                    disabled: true
                },
                {
                    id: 'token',
                    title: 'PLX Token',
                    type: 'item',
                    url: '/token',
                    icon: PLXIcon,
                    breadcrumbs: false,
                    disabled: true
                },
                {
                    id: 'company',
                    title: 'Company',
                    type: 'item',
                    url: '/company',
                    icon: CompanyIcon,
                    breadcrumbs: false,
                    disabled: true
                }
            ]
        }
    ]
};

export default menuItems;
