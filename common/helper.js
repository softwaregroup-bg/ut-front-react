export function download({result, download}) {
    let url = window.URL.createObjectURL(result);
    var a = document.createElement('a');
    a.id = 'downloada';
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = download;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}
