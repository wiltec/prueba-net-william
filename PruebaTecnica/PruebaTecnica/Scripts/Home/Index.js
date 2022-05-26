$(document).ready(function () {    
    GetCategory();
    GetSales();

    $('#selectProduct').attr('disabled', 'disabled');

    $('#selectCategory').on('change', function () {        
        GetProduct(this.value);
    });
});

let data = [];
function GetSales() {

    $.ajax({
        type: "POST",
        //data: model,
        url: "/Home/GetSales",
        beforeSend: function (xhr) {
            $("#loading").show();
        },
        success: function (result) {
            $("#loading").hide();

            //Crear la tabla
            var tableResult = '<table id="dtSales" class="table table-striped table-bordered" style="width:100%">';
            tableResult += '<thead>';
            tableResult += '<tr>';
            tableResult += '<th>Id</th>';
            tableResult += '<th>Monto</th>';
            tableResult += '<th>Fecha</th>';           
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
                tableResult += '    <td> ' + item.IdSales + '</td>';
                tableResult += '    <td> ' + item.TotalAmount + ' </td>';
                tableResult += '    <td> ' + item.CreationDate + '</td>';               
                tableResult += '    <td> <center> <button class="btn btn-primary btn-sm" onclick="OpenDetailModal(' + cont + ');"> <i class="fa-solid fa-grip-lines"></i> </button> </center> </td>';
                tableResult += '</tr>';
                cont++;
            });

            tableResult += '</tbody>';
            tableResult += '</table>';
            $("#divTable").html(tableResult);
            $('#dtSales').DataTable({
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
            $('#dtSales').DataTable();
        }
    });
}

function GetSalesLine(idSales) {

    $.ajax({
        type: "POST",
        data: { idSales: idSales },
        url: "/Home/GetSalesLine",
        beforeSend: function (xhr) {
            $("#loading").show();
        },
        success: function (result) {
            $("#loading").hide();

            //Crear las lineas       
            result.forEach(function (item) {
                $("#tableSalesLine").find("tbody").append("<tr><td>" + item.Quantity + "</td><td>" + item.NameProduct + "</td><td>" + item.CodeProduct + "</td><td>" + item.UnitPrice + "</td><td>" + item.Amount + "</td></tr>");
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
            $('#dtSales').DataTable();
        }
    });
}

function GetProduct(idCategory) {
    
    if (idCategory == -1) {
        $('#selectProduct').attr('disabled', 'disabled');
        $('#selectProduct').find("option").remove();
        $("#selectProduct").append('<option value="-1">--Selecciona un producto--</option>');
        return false;
    }    

    $.ajax({
        type: "POST",
        url: "/Home/GetProduct",
        data: { idCategory: idCategory },
        success: function (result) {

            if (result <= 0) {
                $('#selectProduct').attr('disabled', 'disabled');
                return false;
            }

            $('#selectProduct').removeAttr('disabled');
            $('#selectProduct').find("option").remove();

            $("#selectProduct").append('<option value="-1">--Selecciona un producto--</option>');
            result.forEach(function (item) {
                $("#selectProduct").append('<option value="' + item.IdProduct + '"> ' + item.NameProduct + '</option>');
            });            
        },
        //Si hay algun error entonces enviamos un alert
        error: function (ex) {

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
            });
        },
        //Si hay algun error entonces enviamos un alert
        error: function (ex) {

        }
    });
}

function AddProductTemp() {
    var msjInformacion = "";
    $("#divAlert").html("");

    let idCategory = $('#selectCategory').val();
    let idProduct = $('#selectProduct').val();
    let quantity = $('#txtQuantity').val();

    if (idCategory <= 0 || idProduct <= 0 || quantity <= 0) {        
        msjInformacion += '<div class="alert alert-danger alert-dismissible">';
        msjInformacion += '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Campos requeridos: Categoría, Producto y Cantidad';
        msjInformacion += '</div>';

        $("#divAlert").html(msjInformacion);

        return false;
    }    

    $.ajax({
        type: "POST",
        url: "/Home/GetProduct",
        data: { idProduct: idProduct },
        success: function (result) {

            if (result <= 0) {
                return false;
            }

            total = $("#tdTotal").text();
            total = parseFloat(total);
            amount = 0;
            result.forEach(function (item) {
                amount = quantity * item.Price;
                total = total + amount;
                
                $("#tableProductTemp").find("tbody").append("<tr><td>" + quantity + "</td><td>" + item.NameProduct + "</td><td>" + item.Code + "</td><td style = 'visibility:hidden;'>" + item.IdProduct + "</td><td>" + item.Stock + "</td><td>" + item.Price + "</td><td>" + amount + "</td><td> <center> <button type='button' class='btn btn-danger btn-sm' onclick='RemoveProduct($(this));'> <i class='fa-solid fa-circle-minus'></i> </button> </center></td></tr>");
            });

            $("#tdTotal").text(total);
        },
        //Si hay algun error entonces enviamos un alert
        error: function (ex) {

        }
    });
}

function AddSales() {
    var msjInformacion = "";
    $("#divAlert").html(msjInformacion);
    var total = $("#tdTotal").text();    
    total = parseFloat(total);
    var json = { TotalAmount: total, ListSalesLine: [] };

    //Recorremos la tabla de los productos agregados
    $("#tableProductTemp > tbody").find("tr").each(function () {       

        var quantity = $(this).find("td").eq(0).html();
        var nameProduct = $(this).find("td").eq(1).html();
        var code = $(this).find("td").eq(2).html();
        var idProduct = $(this).find("td").eq(3).html();
        var stock = $(this).find("td").eq(4).html();
        var price = $(this).find("td").eq(5).html();
        var amount = $(this).find("td").eq(6).html();

        let jsonLine = { IdProduct: idProduct, Quantity: quantity, UnitPrice: price, Amount: amount };
        json.ListSalesLine.push(jsonLine);
    });    

    $.ajax({
        type: 'post',
        url: '/Home/AddSales',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(json),
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
                $("#selectCategory").val("-1");
                $("#selectProduct").val("-1");                
                $("#txtQuantity").val("");
                $('#salesModal').modal('toggle');

                $("#tableProductTemp > tbody").find("tr").remove();

                GetSales();
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

function RemoveProduct(element) {
    var trCurrent = $(element).parent().parent().parent();

    var total = $("#tdTotal").text();
    var amountProduct = 0;
    total = parseFloat(total);

    $(trCurrent).find('td').each(function (i, e) {
        if(i==5) {
            amountProduct = parseFloat($(this).html());
            return false;
        }
    });
    
    total = total - amountProduct;
    $("#tdTotal").text(total);
    trCurrent.remove();
}

//openModal, es una funcion que abrira una ventana de dialogo, y recibe un parametro string
function OpenModal() {

    $("#selectCategory").val("-1");
    $("#selectProduct").val("-1");
    $("#txtQuantity").val("");
    $("#tableProductTemp > tbody").find("tr").remove();
    $("#tdTotal").text(0);

    //Abrimos el modal de confirmacion
    $('#salesModal').modal('show');
}

function OpenDetailModal(index) {
    
    $("#tableSalesLine > tbody").find("tr").remove();
    $("#tdDetailTotal").text(data[index].TotalAmount);

    GetSalesLine(data[index].IdSales);

    //Abrimos el modal de confirmacion
    $('#salesLineModal').modal('show');
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