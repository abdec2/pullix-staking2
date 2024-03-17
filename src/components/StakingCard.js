import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

// ==============================|| CUSTOM - MAIN CARD ||============================== //

const MainCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            content = true,
            contentSX = {},
            darkTitle,
            divider = true,
            elevation,
            secondary,
            shadow,
            sx = {},
            title,
            codeHighlight,
            ...others
        },
        ref
    ) => {
        return (
            <Card
                elevation={elevation || 0}
                sx={{
                    ...sx,
                    bgcolor: 'rgba(17, 21, 32, 1)',
                    borderRadius: '0px'
                }}
            >
               

                {/* card content */}
                {content && <CardContent sx={{px: '20px', py: '24px!important'}}>{children}</CardContent>}
               

                
            </Card>
        );
    }
);

MainCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    divider: PropTypes.bool,
    elevation: PropTypes.number,
    secondary: PropTypes.node,
    shadow: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.string,
    codeHighlight: PropTypes.bool,
    content: PropTypes.bool,
    children: PropTypes.node
};

export default MainCard;
