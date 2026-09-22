export function checkExigence(deli: string, n1: string, body: string) {
    if (deli === '[') {
        deli = n1.substring(3, n1.indexOf(']'));
        body = n1.substring(n1.indexOf(']') + 2);
    }

    if (deli && n1.indexOf('][') !== -1) {
        const h = n1.substring(2, n1.indexOf(']\n') + 1);
        body = n1.substring(n1.indexOf(']\n') + 2);

        const declared = h.substring(1, h.length - 1).split('][');

        for (const one of declared) {
            body = body.split(one).join(',');
        }

        deli = ',';
    }

    return { deli, body };
}