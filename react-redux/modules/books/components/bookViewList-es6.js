import React from 'react';
import { connect} from 'react-redux';
import { loadSubjects } from '../reducers/subjects/actionCreators';
import { loadBooks } from '../reducers/books/actionCreators';
import responsiveMobileDesktopMixin from 'util/responsiveUiLoaders';

import DesktopView from './bookViewList-desktop';
import MobileView from './bookViewList-mobile';

import MainNavigationBar from 'applicationRoot/rootComponents/mainNavigation';
import BooksMenuBar from './booklist-menubar/booksMenuBar';
import BookSubjectSetterDesktop from './bookSubjectSetter-desktop';
import SubjectEditModal from './subject-edit/subjectEditModal';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import ManualBookEntry from 'applicationRoot/rootComponents/manualBookEntry';

import * as actionCreatorsSubjects from '../reducers/subjects/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsUi from '../reducers/ui/actionCreators';

import { selector } from '../reducers/reducer';

function BookListLoading() {
    return <div style={{ height: '150px' }}>Loading <i className="fa fa-spinner fa-spin"></i></div>
}

function BookListNoResults() {
    return <div style={{ height: '150px' }}>No results</div>
}

class BookViewingList extends React.Component {
    constructor(){
        super();

        responsiveMobileDesktopMixin(this, 'listComponent', {
            mobile:  { path: './modules/books/components/bookViewList-mobile' },
            desktop: { path: './modules/books/components/bookViewList-desktop' }
        });
    }
    componentDidMount(){
        try {
            if (document.documentElement.clientWidth < 700) {
                this.props.setMobile();
            } else {
                this.props.setDesktop();
            }
        }catch(err){
            this.props.setDesktop();
        }
        this.props.loadSubjects();
    }
    render() {
        let editingBook = this.props.bookEdit.editingBook,
            dragTitle = editingBook ? `Click or drag to upload a ${editingBook.smallImage ? 'new' : ''} cover image.  The uploaded image will be scaled down as needed` : '';

        return (
            <div>
                <MainNavigationBar isBookList={true}></MainNavigationBar>
                <div className="panel panel-default" style={{ margin: '10px' }}>
                    <BooksMenuBar
                        selectedBooksCount={this.props.books.selectedBooksCount}
                        allSubjects={this.props.subjects.list}
                    ></BooksMenuBar>

                    <div className="panel-body" style={{ padding: 0, minHeight: 550, position: 'relative' }}>
                        { this.props.books.loading ?
                            <div className="wait-for-loading">
                                <i className="fa fa-5x fa-spin fa-spinner"></i>
                            </div> : null }

                        { this.props.ui.isDesktop ? <DesktopView />
                            : this.props.ui.isMobile ? <MobileView />
                            : null
                        }
                    </div>
                </div>
                <div className="well well-sm">
                    <img width="16" height="16" src="/static/main-icon.png" />
                    <span>Track my books</span>
                    { this.state.isMobile ?
                        <a onClick={() => this.switchToDesktop()} className="pull-right">Desktop site</a> : null
                    }
                </div>

                <BookSubjectSetterDesktop subjects={this.props.subjects}></BookSubjectSetterDesktop>
                <SubjectEditModal
                    editSubjectsPacket={this.props.subjects.editSubjectsPacket}
                    subjects={this.props.subjects.list}>
                </SubjectEditModal>

                <ManualBookEntry
                    title={editingBook ? `Edit ${editingBook.title}` : ''}
                    dragTitle={dragTitle}
                    bookToEdit={editingBook}
                    isOpen={this.props.bookEdit.isEditing}
                    isSaving={this.props.bookEdit.editingBookSaving}
                    isSaved={this.props.bookEdit.editingBookSaved}
                    saveBook={book => this.props.saveEditingBook(book)}
                    saveMessage={'Saved'}
                    onClosing={this.props.stopEditingBook} />
            </div>
        );
    }
}

const BookViewingListConnected = connect(selector, { ...actionCreatorsEditBook, ...actionCreatorsSubjects, ...actionCreatorsUi })(BookViewingList);
export default BookViewingListConnected;