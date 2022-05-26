$(document).ready(function () {   
    GetCategory();
});

let data = [];
function GetCategory() {    

    $.ajax({
        type: "POST",
        //data: model,
        url: "/Home/GetCategory",
        beforeSend: function (xhr) {
            $("#loading").show();
        },
        success: function (result) {
            $("#loading").hide();

            //Crear la tabla
            var tableResult = '<table id="dtCategory" class="table table-striped table-bordered" style="width:100%">';
            tableResult += '<thead>';
            tableResult += '<tr>';
            tableResult += '<th>Id</th>';
            tableResult += '<th>Nombre</th>';           
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
                tableResult += '    <td> ' + item.IdCategory + '</td>';
                tableResult += '    <td> ' + item.NameCategory + ' </td>';
                tableResult += '    <td> <center> <button class="btn btn-primary btn-sm" onclick="openModalEdit(' + cont + ');"> <i class="fas fa-edit" aria-hidden="true"></i> </button> </center> </td>';
                tableResult += '    <td> <center> <button class="btn btn-danger btn-sm" onclick="openModalDelete(' + cont + ');"> <i class="fa-solid fa-circle-minus"></i> </button> </center> </td>';
                tableResult += '</tr>';
                cont++;
            });

            tableResult += '</tbody>';
            tableResult += '</table>';
            $("#divTable").html(tableResult);
            $('#dtCategory').DataTable({
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
            $('#dtCategory').DataTable();
        }
    });
}

function AddCategory() {
    var msjInformacion = "";
    $("#divAlert").html(msjInformacion);

    var name = $("#txtCategory").val().trim();

    if (name.length == 0) {
        msjInformacion += '<div class="alert alert-warning alert-dismissible">';
        msjInformacion += '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Nombre categoría es obligatorio';
        msjInformacion += '</div>';
        $("#divAlert").html(msjInformacion);
        return false;
    }
    
    let json = { NameCategory: name };
    $.ajax({
        type: 'post',
        url: '/Home/AddCategory',
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
                $("#txtCategory").val("");
                $('#categoryModal').modal('toggle');

                GetCategory();
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
            msjInformacion += '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Error al intentar cargar las imagenes.';
            msjInformacion += '</div>';
            $("#divAlert").html(msjInformacion);
        }
    });
}

function EditCategory() {
    var msjInformacion = "";

    var id = $("#idCategoryE").val().trim();
    var name = $("#txtCategoryE").val().trim();

    if (id <= 0 || name.length == 0) {
        msjInformacion += '<div class="alert alert-warning alert-dismissible">';       
        msjInformacion += '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Nombre categoría es obligatorio';
        msjInformacion += '</div>';
        $("#divAlertE").html(msjInformacion);
        return false;
    }    

    let json = { IdCategory: id, NameCategory: name };

    $.ajax({
        type: 'post',
        url: '/Home/EditCategory',
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
                $('#EditcategoryModal').modal('toggle');
                GetCategory();
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

function DeleteCategory() {
    var msjInformacion = "";

    var id = $("#idCategoryD").val().trim();    

    let json = { id: id};

    $.ajax({
        type: 'post',
        url: '/Home/DeleteCategory',
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
                $('#DeletecategoryModal').modal('toggle');
                GetCategory();
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
    $("#name").val("");    

    //Abrimos el modal de confirmacion
    $('#categoryModal').modal('show');
}

function openModalEdit(index) {

    $("#divAlertE").html("");
   
    //Establecemos el valor del ID en textbox hidden
    $('#idCategoryE').val(data[index].IdCategory);
    $("#txtCategoryE").val(data[index].NameCategory);

    //Abrimos el modal de confirmacion
    $('#EditcategoryModal').modal('show');
}

function openModalDelete(index) {

    $("#divAlertD").html("");

    //Establecemos el valor del ID en textbox hidden
    $('#idCategoryD').val(data[index].IdCategory);

    $("#lblDelete").text(data[index].IdCategory);

    //Abrimos el modal de confirmacion
    $('#DeletecategoryModal').modal('show');
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