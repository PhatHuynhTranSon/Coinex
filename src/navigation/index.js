import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";
import AppsIcon from '@material-ui/icons/Apps';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Logo from "./logo";


const useStyles = makeStyles({
    paper: {
        width: "240px"
    }
});

const Navigation = () => {
    const classes = useStyles();

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={true}
            classes={{ paper: classes.paper }}>
            <Logo>Coinex</Logo>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon><MonetizationOnIcon/></ListItemIcon>
                    <ListItemText>One coin</ListItemText>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><AppsIcon/></ListItemIcon>
                    <ListItemText>All coins</ListItemText>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </ListItem>
            </List>
        </Drawer>
    )
}

export default Navigation;