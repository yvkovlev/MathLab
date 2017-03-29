$(document).ready(function() {
  $("#avatar").fileinput({
    overwriteInitial: true,
    maxFileSize: 1500,
    showClose: false,
    showCaption: false,
    browseLabel: 'Выбрать...',
    removeLabel: 'Удалить',
    uploadLabel: 'Загрузить',
    browseIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i>',
    removeIcon: '<i class="fa fa-close" aria-hidden="true"></i>',
    uploadIcon: '<i class="fa fa-upload" aria-hidden="true"></i>',
    browseClass: 'btn btn-default',
    removeTitle: 'Отменить',
    elErrorContainer: '#kv-avatar-errors-1',
    msgErrorClass: 'alert alert-block alert-danger',
    defaultPreviewContent: '<img src="/images/profile.svg" alt="Ваш аватар" style="width:160px">',
    layoutTemplates: {main2: '{preview} ' + '<div class="btn-group">' + '{browse} {remove} {upload}' + '</div>'},
    allowedFileExtensions: ["jpg", "jpeg", "png"]
  });
});