import {Form} from './form';

export const escapeHtml = (text) => {
    return text.replace(/[\"&<>]/g, (a) => {
        return {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}[a];
    });
};

$(() => {
    var form = new Form('form', '#email-preview');
});
