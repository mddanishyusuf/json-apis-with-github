import axios from 'axios';

export function sortContentArray(array) {
    if (array.length > 0) {
        array.sort(function(x, y) {
            // true values first
            return x.type === y.type ? 0 : x.type === 'dir' ? -1 : 1;
            // false values first
            // return (x === y)? 0 : x? 1 : -1;
        });
    }
    return array;
}

export function checkFileType(content) {
    const fileNameIntoArray = content.name.split('.');
    const fileExt = fileNameIntoArray[1] === 'json' || fileNameIntoArray[1] === undefined;
    return fileExt;
}

export async function getData(location) {
    const param = location.pathname.split('/editor/')[1];
    const accessToken = localStorage.getItem('token');
    try {
        const response = await axios.get(`https://api.github.com/repos/${param}/contents?access_token=${accessToken}`, {
            headers: { 'If-None-Match': '' },
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

export async function UpdateFile(path, param, location) {
    const accessToken = localStorage.getItem('token');
    const pathName = location.pathname.split('/editor/')[1];
    try {
        const response = await axios.put(
            `https://api.github.com/repos/${pathName}/contents/${path}?access_token=${accessToken}`,
            param
        );
        return response;
    } catch (error) {
        return error;
    }
}

export async function deleteFile(param, location, path) {
    const accessToken = localStorage.getItem('token');
    const pathName = location.pathname.split('/editor/')[1];
    try {
        const response = await axios.delete(
            `https://api.github.com/repos/${pathName}/contents/${path}?access_token=${accessToken}`,
            { data: param }
        );
        return response;
    } catch (error) {
        return error;
    }
}

export async function CrateANewFile(path, param, location) {
    const accessToken = localStorage.getItem('token');
    const pathName = location.pathname.split('/editor/')[1];
    try {
        const response = await axios.put(
            `https://api.github.com/repos/${pathName}/contents/${path}?access_token=${accessToken}`,
            param
        );
        return response;
    } catch (error) {
        return error;
    }
}
