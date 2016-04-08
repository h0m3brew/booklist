const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;

class MainNavigationBar extends React.Component {
    logout(){
        ajaxUtil.post('/react-redux/logout', { }, () => window.location = '/react-redux/login');
    }
    render() {
        let isBookEntry = this.props.isBookEntry,
            isBookList = this.props.isBookList;

        return (
            <Navbar fluid={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a style={{ cursor: 'default' }}>Book Tracker</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem active={isBookEntry} href={isBookEntry ? undefined : '#bookEntry'}>Book entry</NavItem>
                        <NavItem active={isBookList} href={isBookList ? undefined : '#bookList'}>Your books</NavItem>
                        <NavItem onClick={this.logout}>Logout</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainNavigationBar;