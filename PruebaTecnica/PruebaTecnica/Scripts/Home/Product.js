$(document).ready(function () {
    GetProduct();
    GetCategory();
});

let data = [];
function GetProduct() {

    $.ajax({
        type: "POST",
        //data: model,
        url: "/Home/GetProduct",
        beforeSend: function (xhr) {
            $("#loading").show();
        },
        success: function (result) {
            $("#loading").hide();

            //Crear la tabla
            var tableResult = '<table id="dtProduct" class="table table-striped table-bordered" style="width:100%">';
            tableResult += '<thead>';
            tableResult += '<tr>';
            tableResult += '<th>Id</th>';
            tableResult += '<th>Nombre</th>';
            tableResult += '<th>Precio</th>';            
            tableResult += '<th>Categoría</th>';
            tableResult += '<th>Modelo comercial</th>';
            tableResult += '<th>Código</th>';
            tableResult += '<th>Stock</th>';
            tableResult += '<th></th>';
            tableResult += '<th></th>';
            tableResult += '</tr>';
            tableResult += '</thead>';
            tableResult += '<tbody>';

            if (result.length > 0) {
                data = result;
            }

            let cont = 0;

            result.forEach(function (item) {
                tableResult += '<tr>';
                tableResult += '    <td> ' + item.IdProduct + '</td>';
                tableResult += '    <td> ' + item.NameProduct + ' </td>';
                tableResult += '    <td> ' + item.Price + '</td>';                
                tableResult += '    <td> ' + item.NameCategory + ' </td>';
                tableResult += '    <td> ' + item.BussinessModel + '</td>';
                tableResult += '    <td> ' + item.Code + ' </td>';
                tableResult += '    <td> ' + item.Stock + '</td>';
                tableResult += '    <td> <center> <button class="btn btn-primary btn-sm" onclick="openModalEdit(' + cont + ');"> <i class="fas fa-edit" aria-hidden="true"></i> </button> </center> </td>';
                tableResult += '    <td> <center> <button class="btn btn-danger btn-sm" onclick="openModalDelete(' + cont + ');"> <i class="fa-solid fa-circle-minus"></i> </button> </center> </td>';
                tableResult += '</tr>';
                cont++;
            });

            tableResult += '</tbody>';
            tableResult += '</table>';
            $("#divTable").html(tableResult);
            $('#dtProduct').DataTable({
                "language": ObtenerLenguajeEspañolDT()
            });

        },
        //Si hay algun error entonces enviamos un alert
        error: function (ex) {
            $("#loading").hide();
            $("#divAlert").html("");
            var msjInformacion = '<div class="alert alert-warning alert-dismissible">';
            msjInformacion += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
            msjInformacion += '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Ocurrio un error al consultar los datos, intentar de nuevo';
            msjInformacion += '</div>';
            $('#dtProduct').DataTable();
        }
    });
}

function GetCategory() {

    $.ajax({
        type: "POST",        
        url: "/Home/GetCategory",        
        success: function (result) {

            result.forEach(function (item) {
                $("#selectCategory").append('<option value="' + item.IdCategory + '"> ' + item.NameCategory + '</option>');
                $("#selectCategoryE").append('<option value="' + item.IdCategory + '"> ' + item.NameCategory + '</option>');
            });
        },
        //Si hay algun error entonces enviamos un alert
        error: function (ex) {
                       
        }
    });
}

function AddProduct() {
    var msjInformacion = "";
    $("#divAlert").html(msjInformacion);

    var name = $("#txtNameProduct").val().trim();
    var businesModel = $("#txtModel").val().trim();
    var code = $("#txtCode").val().trim();
    var category = $("#selectCategory").val();
    var price = $("#txtPrice").val();
    var stock = $("#txtStock").val();    

    let json = { NameProduct: name, Price: price, IdCategory: category, BussinessModel: businesModel, Code: code, Stock: stock };
    $.ajax({
        type: 'post',
        url: '/Home/AddProduct',
        data: json,
        dataType: 'json',
        beforeSend: function (xhr) {
            $("#loading").show();
            $("#btnAdd").prop('disabled', true);
        },
        success: function (response) {
            $("#loading").hide();
            $("#btnAdd").prop('disabled', false);

            var msjInformacion = '<div class="alert alert-success alert-dismissible">';
            var error = '<i class="fa fa-check" aria-hidden="true"></i> ' + response.msg;

            if (response.result) {
                $("#txtNameProduct").val("");
                $("#txtModel").val("");
                $("#txtCode").val("");
                $("#selectCategory").val("-1");
                $("#txtPrice").val("");
                $("#txtStock").val("");
                $('#productModal').modal('toggle');

                GetProduct();
            }
            else {
                msjInformacion = '<div class="alert alert-danger alert-dismissible">';
                error = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + response.msg;
            }

            msjInformacion += error
            msjInformacion += '</div>';

            $("#divAlert").html(msjInformacion);
        },
        error: function (error) {
            $("#loading").hide();

            msjInformacion += '<div class="alert alert-warning alert-dismissible">';
            msjInformacion += '<button type="button" class="close" data-dismiss="alert">&times;</button>';            
            msjInformacion += '</div>';
            $("#divAlert").html(msjInformacion);
        }
    });
}

function EditProduct() {
    var msjInformacion = "";

    var id = $("#idProductE").val().trim();
    var name = $("#txtNameProductE").val().trim();
    var businesModel = $("#txtModelE").val().trim();
    var code = $("#txtCodeE").val().trim();
    var category = $("#selectCategoryE").val();
    var price = $("#txtPriceE").val();
    var stock = $("#txtStockE").val();    

    let json = { IdProduct: id, NameProduct: name, Price: price, IdCategory: category, BussinessModel: businesModel, Code: code, Stock: stock };   

    $.ajax({
        type: 'post',
        url: '/Home/EditProduct',
        data: json,
        dataType: 'json',
        beforeSend: function (xhr) {
            $("#loading").show();
            $("#btnEdit").prop('disabled', true);
        },
        success: function (response) {
            $("#loading").hide();
            $("#btnEdit").prop('disabled', false);

            var msjInformacion = '<div class="alert alert-success alert-dismissible">';
            var error = '<i class="fa fa-check" aria-hidden="true"></i> ' + response.msg;

            if (response.result) {
                $('#productModalE').modal('toggle');
                GetProduct();
            }
            else {
                msjInformacion = '<div class="alert alert-danger alert-dismissible">';
                error = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + response.msg;
            }

            msjInformacion += error
            msjInformacion += '</div>';

            $("#divAlertE").html(msjInformacion);
        },
        error: function (error) {
            $("#loading").hide();

            msjInformacion += '<div class="alert alert-warning alert-dismissible">';
            msjInformacion += '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Error.';
            msjInformacion += '</div>';
            $("#divAlertE").html(msjInformacion);
        }
    });
}

function DeleteProduct() {
    var msjInformacion = "";
    var id = $("#idProductD").val().trim();

    let json = { id: id };

    $.ajax({
        type: 'post',
        url: '/Home/DeleteProduct',
        data: json,
        dataType: 'json',
        beforeSend: function (xhr) {
            $("#loading").show();
            $("#btnDelete").prop('disabled', true);
        },
        success: function (response) {
            $("#loading").hide();
            $("#btnDelete").prop('disabled', false);

            var msjInformacion = '<div class="alert alert-success alert-dismissible">';
            var error = '<i class="fa fa-check" aria-hidden="true"></i> ' + response.msg;

            if (response.result) {
                $('#DeleteProductModal').modal('toggle');
                GetProduct();
            }
            else {
                msjInformacion = '<div class="alert alert-danger alert-dismissible">';
                error = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + response.msg;
            }

            msjInformacion += error
            msjInformacion += '</div>';

            $("#divAlertD").html(msjInformacion);
        },
        error: function (error) {
            $("#loading").hide();

            msjInformacion += '<div class="alert alert-warning alert-dismissible">';
            msjInformacion += '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Error.';
            msjInformacion += '</div>';
            $("#divAlertD").html(msjInformacion);
        }
    });
}

//openModal, es una funcion que abrira una ventana de dialogo, y recibe un parametro string
function OpenModal() {

    $("#divAlert").html("");
    $("#txtNameProduct").val("");
    $("#txtModel").val("");
    $("#txtCode").val("");
    $("#selectCategory").val("-1");
    $("#txtPrice").val("");
    $("#txtStock").val("");

    //Abrimos el modal de confirmacion
    $('#productModal').modal('show');
}

function openModalEdit(index) {

    $("#divAlertE").html("");

    //Establecemos el valor del ID en textbox hidden
    $('#idProductE').val(data[index].IdProduct);
    $("#txtNameProductE").val(data[index].NameProduct);
    $("#txtModelE").val(data[index].BussinessModel);
    $("#txtCodeE").val(data[index].Code);
    $("#selectCategoryE").val(data[index].IdCategory);
    $("#txtPriceE").val(data[index].Price);
    $("#txtStockE").val(data[index].Stock);

    //Abrimos el modal de confirmacion
    $('#productModalE').modal('show');
}

function openModalDelete(index) {

    $("#divAlertD").html("");

    //Establecemos el valor del ID en textbox hidden
    $('#idProductD').val(data[index].IdProduct);

    $("#lblDelete").text(data[index].IdProduct);

    //Abrimos el modal de confirmacion
    $('#DeleteProductModal').modal('show');
}

function CloseDialog(element) {
    $(element).modal('toggle');
}

function ObtenerLenguajeEspañolDT() {
    var json = {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla =(",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        },
        "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad"
        }
    }

    return json;
}