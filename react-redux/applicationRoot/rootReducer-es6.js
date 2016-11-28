import {createSelector} from 'reselect';

import {
    SET_PUBLIC_INFO,
    RESET_PUBLIC_INFO,
    SET_LOGGED_IN,
    SET_DESKTOP,
    SET_MOBILE,
    REQUEST_DESKTOP,
    REQUEST_MOBILE,
    SET_MODULE,
    LOAD_SUBJECTS,
    LOAD_SUBJECTS_RESULTS,
    LOAD_COLORS,
    SAVE_SUBJECT_RESULTS,
    SUBJECT_DELETED
} from './rootReducerActionNames';

const initialState = {
    publicUserId: '',
    publicName: '',
    publicBooksHeader: '',
    isPublic: false,
    isDesktop: false,
    showingDesktop: false,
    isMobile: false,
    showingMobile: false,
    subjectHash: {},
    colors: [],
    module: '',
    isLoggedIn: false,
    subjectsLoaded: false,
    subjectsInitialQueryFired: false
};

export const subjectsToHash = subjects => subjects.reduce((hash, s) => (hash[s._id] = s, hash), {});

export default function rootReducer(state = initialState, action){
    switch(action.type){
        case SET_PUBLIC_INFO:
            return { ...state, isPublic: true, publicName: action.name, publicBooksHeader: action.booksHeader, publicUserId: action._id };
        case RESET_PUBLIC_INFO:
            return { ...state, isPublic: false, publicName: '', publicBooksHeader: '', publicUserId: '' };
        case SET_DESKTOP:
            return { ...state, isDesktop: true, showingDesktop: true, isMobile: false, showingMobile: false };
        case SET_MOBILE:
            return { ...state, isDesktop: false, showingDesktop: false, isMobile: true, showingMobile: true };
        case REQUEST_DESKTOP:
            return { ...state, showingDesktop: true, showingMobile: false };
        case REQUEST_MOBILE:
            return { ...state, showingDesktop: false, showingMobile: true };
        case SET_MODULE:
            return {...state, module: action.module};
        case SET_LOGGED_IN:
            return {...state, isLoggedIn: true};
        case LOAD_SUBJECTS:
            return Object.assign({}, state, { subjectsInitialQueryFired: true });
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjectHash: subjectsToHash(action.subjects), subjectsLoaded: true });
        case LOAD_COLORS:
            return Object.assign({}, state, { colors: action.colors.map(c => c.backgroundColor) });
        case SAVE_SUBJECT_RESULTS:
            return Object.assign({}, state, { subjectHash: { ...state.subjectHash, ...subjectsToHash(action.affectedSubjects) } });
        case SUBJECT_DELETED:
            let subjectHash = { ...state.subjectHash };
            action.subjectsDeleted.forEach(_id => delete subjectHash[_id]);
            return {...state, subjectHash};
    }

    return state;
}

export const unwindSubjects = subjects => {
    let result = [];
    subjects.forEach(s => result.push(s, ...unwindSubjects(s.children || [])));
    return result;
};

export const subjectSortCompare = ({ name: name1 }, { name: name2 }) => {
    let name1After = name1.toLowerCase() > name2.toLowerCase(),
        bothEqual = name1.toLowerCase() === name2.toLowerCase();
    return bothEqual ? 0 : (name1After ? 1 : -1);
};

export const topLevelSubjectsSorted = createSelector(
    [state => state.app.subjectHash],
    subjectHash => Object.keys(subjectHash).map(_id => subjectHash[_id]).filter(s => !s.path).sort(subjectSortCompare)
);

export const getAllDescendantsOfSubject = (_id, subjectHash) => {
    let regex = new RegExp(`,${_id},`);
    return Object.keys(subjectHash).map(_id => subjectHash[_id]).filter(s => regex.test(s.path));
}

export const getChildSubjectsSorted = (_id, subjectHash) => {
    let regex = new RegExp(`,${_id},$`);
    return Object.keys(subjectHash)
                 .map(_id => subjectHash[_id])
                 .filter(sc => regex.test(sc.path))
                 .sort(subjectSortCompare);
};

export const stackAndGetTopLevelSubjects = subjectsHash => {
    let subjects = Object.keys(subjectsHash).map(_id => ({...subjectsHash[_id]}));
    subjects.sort(subjectSortCompare).forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)).sort(subjectSortCompare));
        s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
    });
    return subjects.filter(s => s.path == null);
};

export const computeParentId = path => {
    if (path){
        let pathParts = path.split(',');
        return pathParts[pathParts.length - 2];
    } else {
        return '';
    }
}

export const flattenSubjects = subjects => Object.keys(subjects).map(k => subjects[k]);

export const getEligibleParents = (subjectHash, _id) => {
    let eligibleParents = null;
    if (!_id && _id != null){
        eligibleParents = flattenSubjects(subjectHash)
    } else if (_id) {
        eligibleParents = flattenSubjects(subjectHash).filter(s => s._id !== _id && (!new RegExp(`,${_id},`).test(s.path)));
    }
    if (eligibleParents){
        eligibleParents.sort(subjectSortCompare);
    }

    return eligibleParents;
}

export const subjectsSelector = createSelector([subjectHash => subjectHash], subjectHash => ({
    subjects: stackAndGetTopLevelSubjects(subjectHash)
}));