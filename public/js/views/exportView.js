define([
    "text!templates/exportTemplate.html",

], function (exportTemplate) {

    var ExportView = Backbone.View.extend({
        el      : '#content-holder',
        template: exportTemplate,

        initialize: function (options) {
            this.selectedIds = options.selectedIds;
            this.contentType = options.type;
            this.urls = {
                importable: {
                    csv : options.exportToCsvUrl,
                    xlsx: options.exportToXlsxUrl
                },
                allData   : {
                    csv : options.exportToCsvFullDataUrl,
                    xlsx: options.exportToXlsxFullDataUrl
                }

            };
            this.fileName = options.fileName;
            this.render();
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
        },

        render: function () {

            var formString = this.template;
            var self = this;
            this.$el = $(formString).dialog({
                closeOnEscape: false,
                dialogClass  : "edit-dialog",
                width        : 480,
                parentView   : this,
                buttons      : {
                    export: {
                        text : "Export",
                        class: "btn",
                        click: function () {
                            var fileType = $('input:radio[name=fileType]:checked').val();
                            var exportType = $('input:radio[name=exportType]:checked').val();
                            var url = self.urls[exportType][fileType];

                            self.postAndExport(url, {
                                    items   : self.selectedIds,
                                    type    : self.type,
                                    fileName: self.fileName
                                }
                            );
                          //  alert(url);
                        }
                    },
                    cancel: {
                        text : "Cancel",
                        class: "btn",
                        click: self.hideDialog
                    }

                }
            });

            return this;
        },

        postAndExport: function (url, options) {

            body = JSON.stringify(options);

            $.ajax({
                url        : url,
                type       : "POST",
                data       : body,
                contentType: 'application/json',
                success    : function (resp) {
                    window.location = resp.url;
                },
                error      : function (err) {
                    alert(err);
                }
            });
        }

    });

    return ExportView;

});
