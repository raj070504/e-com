import getBaseUrl from './baseURL';

function getImgUrl(name) {
    return `${getBaseUrl()}${name}`;
}

export { getImgUrl };