/**
 * @author Fouad Nashat <fouad@jfordev.com>
 */

this.currentPageNum = 0;
this.totalNoPages = 0;

function displayNextPage() {
    if (++this.currentPageNum > this.totalNoPages) {
        this.currentPageNum = this.totalNoPages;
        return;
    }
    displayCurrentPage();
    renderPageNum();
}

function displayPreviousPage() {
    if (--this.currentPageNum < 1) {
        this.currentPageNum = 1;
        return;
    }
    displayCurrentPage();
    renderPageNum();
}

function renderPageNum() {
    document.getElementById('pageNum').innerHTML = this.currentPageNum;
    document.getElementById('totalPages').innerHTML = this.totalNoPages;
    document.getElementById('url').innerHTML = this.pdfURL;
}

function renderLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function renderError(error) {
    document.getElementById('error').innerHTML = error;
    document.getElementById('error').style.display = 'block';
}

function hideError() {
    document.getElementById('error').innerHTML = "";
    document.getElementById('error').style.display = 'none';
}

function readURLAndLoadPDF() {
    hideError();
    renderLoading();
    url = document.getElementById('pdfURL').value;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.js';
    loadPDF(url);
}

function loadPDF(pdfURL) {
    this.pdfURL = pdfURL;
    loadedDocument = pdfjsLib.getDocument(pdfURL).then(pdf => {
        hideLoading();
        this.totalNoPages = pdf._pdfInfo.numPages;
        this.currentPageNum = 1;

        renderPageNum();
        this.pdfPage = pdf;
        displayCurrentPage();
    }, error => {
        hideLoading();
        renderError(error);
    });

}

function displayCurrentPage() {
    this.pdfPage.getPage(this.currentPageNum).then(page => {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById('pdf-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.then(() => console.log('Page rendered'));
    }).catch(error => renderError(error));
}