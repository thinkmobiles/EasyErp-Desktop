define([
        "text!templates/Invoice/EditTemplate.html",
        'views/Assignees/AssigneesView',
        "views/Invoice/InvoiceProductItems",
        "views/Payment/CreateView",
        "views/Payment/list/ListHeaderInvoice",
        "common",
        "custom",
        "dataService",
        "populate",
        'constants'
    ],
    function (EditTemplate, AssigneesView, InvoiceItemView, PaymentCreateView, listHederInvoice, common, Custom, dataService, populate, CONSTANTS) {

        var EditView = Backbone.View.extend({
            contentType: "Invoice",
            template: _.template(EditTemplate),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");
                _.bindAll(this, "render", "deleteItem");
                this.currentModel = (options.model) ? options.model : options.collection.getElement();
                this.currentModel.urlRoot = "/Invoice";
                this.responseObj = {};
                this.render();
            },

            events: {
                "click #saveBtn": "saveItem",
                "click #cancelBtn": "hideDialog",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect",
                'click .dialog-tabs a': 'changeTab',
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
                "click .newSelectList li.miniStylePagination": "notHide",
                "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
                "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
                "click .details": "showDetailsBox",
                "click .newPayment": "newPayment",
                "click .cancelInvoice": "cancelInvoice",
                "click .refund": "refund",
                "click .setDraft": "setDraft"

            },

            newPayment: function (e) {
                e.preventDefault();

                var paymentView = new PaymentCreateView({model: this.currentModel});

            },

            cancelInvoice: function (e) {
                e.preventDefault();

                var self = this;

                populate.fetchWorkflow({
                    wId: 'Invoice',
                    source: 'purchase',
                    targetSource: 'invoice',
                    status: 'Cancelled',
                    order: 1
                }, function (workflow) {
                    if (workflow && workflow.error) {
                        return alert(workflow.error.statusText);
                    }

                    self.currentModel.save({
                        workflow: workflow._id
                    }, {
                        headers: {
                            mid: 57
                        },
                        patch: true,
                        success: function () {
                            Backbone.history.navigate("easyErp/Invoice", {trigger: true});
                        }
                    });
                });
            },

            setDraft: function (e) {
                e.preventDefault();

                var self = this;

                populate.fetchWorkflow({
                    wId: 'Invoice'
                }, function (workflow) {
                    if (workflow && workflow.error) {
                        return alert(workflow.error.statusText);
                    }

                    self.currentModel.save({
                        workflow: workflow._id
                    }, {
                        headers: {
                            mid: 57
                        },
                        patch: true,
                        success: function () {
                            Backbone.history.navigate("easyErp/Invoice", {trigger: true});
                        }
                    });
                });
            },

            showDetailsBox: function (e) {
                $(e.target).parent().find(".details-box").toggle();
            },
            notHide: function () {
                return false;
            },
            nextSelect: function (e) {
                this.showNewSelect(e, false, true);
            },
            prevSelect: function (e) {
                this.showNewSelect(e, true, false);
            },

            changeTab: function (e) {
                var holder = $(e.target);
                var n;
                var dialog_holder;
                var closestEl = holder.closest('.dialog-tabs');
                var dataClass = closestEl.data('class');
                var selector = '.dialog-tabs-items.' + dataClass;
                var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
                var itemSelector = '.dialog-tabs-item.' + dataClass;

                closestEl.find("a.active").removeClass("active");
                holder.addClass("active");

                n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
                dialog_holder = $(selector);

                dialog_holder.find(itemActiveSelector).removeClass("active");
                dialog_holder.find(itemSelector).eq(n).addClass("active");
            },

            chooseUser: function (e) {
                $(e.target).toggleClass("choosen");
            },

            hideDialog: function () {
                $('.edit-invoice-dialog').remove();
            },

            saveItem: function () {
                var self = this;
                var mid = 56;

                var selectedProducts = this.$el.find('.productItem');
                var products = [];
                var selectedLength = selectedProducts.length;
                var targetEl;
                var productId;
                var quantity;
                var price;
                var description;
                var taxes;
                var amount;
                var workflow = this.currentModel.workflow ? this.currentModel.workflow._id : null;

                var invoiceDate = this.$el.find("#invoice_date").val();
                var dueDate = this.$el.find("#due_date").val();

                var supplier = this.$el.find('#supplier').data("id");
                supplier = (supplier) ? supplier : null;

                var total = parseFloat(this.$("#totalAmount").text());
                var unTaxed = parseFloat(this.$("#totalUntaxes").text());
                var balance = parseFloat(this.$("#balance").text());

                var payments = {
                    total: total,
                    unTaxed: unTaxed,
                    balance: balance
                };

                if (selectedLength) {
                    for (var i = selectedLength - 1; i >= 0; i--) {
                        targetEl = $(selectedProducts[i]);
                        productId = targetEl.data('id');
                        if (productId) {
                            quantity = targetEl.find('[data-name="quantity"]').text();
                            price = targetEl.find('[data-name="price"]').text();
                            description = targetEl.find('[data-name="productDescr"]').text();
                            taxes = targetEl.find('.taxes').text();
                            amount = targetEl.find('.amount').text();

                            products.push({
                                product: productId,
                                description: description,
                                unitPrice: price,
                                quantity: quantity,
                                taxes: taxes,
                                amount: amount
                            });
                        }
                    }
                }

                var salesPersonId = this.$("#salesPerson").data("id") ? this.$("#salesPerson").data("id") : null;
                var paymentTermId = this.$("#payment_terms").data("id") ? this.$("#payment_terms").data("id") : null;

                var usersId = [];
                var groupsId = [];
                $(".groupsAndUser tr").each(function () {
                    if ($(this).data("type") == "targetUsers") {
                        usersId.push($(this).data("id"));
                    }
                    if ($(this).data("type") == "targetGroups") {
                        groupsId.push($(this).data("id"));
                    }

                });
                var whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();

                var data = {

                    supplier: supplier,
                    fiscalPosition: null,
                    sourceDocument: $.trim(this.$el.find('#source_document').val()),
                    supplierInvoiceNumber: $.trim(this.$el.find('#supplier_invoice_num').val()),
                    paymentReference: $.trim(this.$el.find('#payment_reference').val()),
                    invoiceDate: invoiceDate,
                    dueDate: dueDate,
                    account: null,
                    journal: null,

                    salesPerson: salesPersonId,
                    paymentTerms: paymentTermId,

                    products: products,
                    paymentInfo: payments,

                    groups: {
                        owner: $("#allUsersSelect").data("id"),
                        users: usersId,
                        group: groupsId
                    },
                    whoCanRW: whoCanRW,
                    workflow: workflow

                };


                if (supplier) {
                    this.model.save(data, {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch: true,
                        success: function () {
                            self.hideDialog();
                            Backbone.history.navigate("easyErp/Invoice", {trigger: true});
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });

                } else {
                    alert(CONSTANTS.RESPONSES.CREATE_QUOTATION);
                }
            },

            showNewSelect: function (e, prev, next) {
                populate.showSelect(e, prev, next, this);
                return false;

            },

            hideNewSelect: function () {
                $(".newSelectList").hide();
            },
            chooseOption: function (e) {
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },


            deleteItem: function (event) {

                event.preventDefault();
                var self = this;
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) {
                    this.currentModel.destroy({
                        success: function () {
                            $('.edit-invoice-dialog').remove();
                            Backbone.history.navigate("easyErp/" + self.contentType, {trigger: true});
                        },
                        error: function (model, err) {
                            if (err.status === 403) {
                                alert("You do not have permission to perform this action");
                            }
                        }
                    });
                }

            },

            render: function () {
                var self = this;
                var formString = this.template({
                    model: this.currentModel.toJSON()
                });
                var notDiv;
                var model;
                var invoiceItemContainer;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "edit-invoice-dialog",
                    title: "Edit Invoice",
                    width: "900",
                    position: {my: "center bottom", at: "center", of: window},
                    buttons: [
                        {
                            text: "Save",
                            click: self.saveItem
                        },

                        {
                            text: "Cancel",
                            click: function () {
                                self.hideDialog();
                            }
                        },
                        {
                            text: "Delete",
                            click: self.deleteItem
                        }
                    ]

                });

                notDiv = this.$el.find('.assignees-container');
                notDiv.append(
                    new AssigneesView({
                        model: this.currentModel
                    }).render().el
                );

                var paymentContainer = this.$el.find('#payments-container');
                paymentContainer.append(
                    new listHederInvoice().render({model: this.currentModel.toJSON()}).el
                );

                populate.get2name("#supplier", "/supplier", {}, this, false);
                populate.get2name("#salesPerson", "/getForDdByRelatedUser", {}, this, true, true);
                populate.get("#paymentTerm", "/paymentTerm", {}, 'name', this, true, true);

                this.$el.find('#invoice_date').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });

                this.$el.find('#due_date').datepicker({
                    dateFormat: "d M, yy",
                    changeMonth: true,
                    changeYear: true
                });

                this.delegateEvents(this.events);
                model = this.currentModel.toJSON();

                invoiceItemContainer = this.$el.find('#invoiceItemsHolder');
                invoiceItemContainer.append(
                    new InvoiceItemView({balanceVisible: true}).render({model: model}).el
                );

                if (model.groups)
                    if (model.groups.users.length > 0 || model.groups.group.length) {
                        $(".groupsAndUser").show();
                        model.groups.group.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.departmentName + "</td><td class='text-right'></td></tr>");
                            $("#targetGroups").append("<li id='" + item._id + "'>" + item.departmentName + "</li>");
                        });
                        model.groups.users.forEach(function (item) {
                            $(".groupsAndUser").append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                            $("#targetUsers").append("<li id='" + item._id + "'>" + item.login + "</li>");
                        });

                    }


                return this;
            }

        });

        return EditView;
    });
