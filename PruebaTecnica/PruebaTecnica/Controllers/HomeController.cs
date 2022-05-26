using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using PruebaTecnica.Utils;
using System.Data;
using PruebaTecnica.Models;

namespace PruebaTecnica.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Product()
        {
            return View();
        }

        public ActionResult Category()
        {
            return View();
        }

        #region Funciones Category

        [HttpPost]
        public JsonResult GetCategory()
        {
            try
            {
                var listModel = new List<CategoryModel>();

                using(ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();                    

                    var reader = new MySqlCommand("SELECT * FROM Category", context.Conexion).ExecuteReader();
                    
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            listModel.Add(new CategoryModel {
                                IdCategory =  reader.GetInt32(0),
                                NameCategory = reader.GetString(1)
                            });
                        }
                    }
                    
                    reader.Close();
                }

                return Json(listModel);
            }
            catch (Exception Ex)
            {
                return Json(new List<CategoryModel>());
            }
        }

        [HttpPost]
        public JsonResult AddCategory(CategoryModel model)
        {
            try
            {
                //Validaciones datos entrada
                var msg = ValidateField(EnumTypes.STRING, 150, model.NameCategory);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Nombre", msg) });

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    MySqlCommand cmd;
                    var count = 0;

                    //Verificamo si ya existe la categoría
                    cmd = new MySqlCommand("SELECT COUNT(*) FROM Category WHERE NameCategory = @NameCategory", context.Conexion);
                    cmd.Parameters.AddWithValue("@NameCategory", (object)model.NameCategory);

                    MySqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows && reader.Read())
                        count = reader.GetInt32(0);

                    reader.Close();

                    if (count > 0)                    
                        return Json(new { result = false, msg = "Ya existe la categoría" });

                    cmd = new MySqlCommand("INSERT INTO Category (NameCategory) VALUES(@NameCategory)", context.Conexion);
                    cmd.Parameters.AddWithValue("@NameCategory", (object)model.NameCategory);
                    cmd.ExecuteScalar();
                }

                return Json(new { result = true, msg = "Datos guardados correctamente" });
            }
            //en caso de error regresamos un Json de error
            catch (Exception ex)
            {
                return Json(new { result = false, msg = "Error al intentar guardar los datos" });
            }
        }

        [HttpPost]
        public JsonResult EditCategory(CategoryModel model)
        {
            try
            {
                //Validaciones datos entrada
                var msg = ValidateField(EnumTypes.INT, 0, model.IdCategory);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Id", msg) });
                
                msg = ValidateField(EnumTypes.STRING, 150, model.NameCategory);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Nombre", msg) });

                var idCategoryAux = 0;                

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    MySqlCommand cmd;                   

                    //Verificamo si ya existe la categoría
                    cmd = new MySqlCommand("SELECT * FROM Category WHERE NameCategory = @NameCategory LIMIT 1", context.Conexion);
                    cmd.Parameters.AddWithValue("@NameCategory", (object)model.NameCategory);

                    MySqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows && reader.Read())
                        idCategoryAux = reader.GetInt32(0);

                    reader.Close();

                    if (idCategoryAux != 0 && idCategoryAux != model.IdCategory)
                        return Json(new { result = false, msg = "Ya existe la categoría" });

                    cmd = new MySqlCommand("UPDATE Category SET NameCategory = @NameCategory WHERE IdCategory = @IdCategory", context.Conexion);
                    cmd.Parameters.AddWithValue("@NameCategory", (object)model.NameCategory);
                    cmd.Parameters.AddWithValue("@IdCategory", (object)model.IdCategory);
                    cmd.ExecuteScalar();
                }

                return Json(new { result = true, msg = "Datos guardados correctamente" });
            }
            //en caso de error regresamos un Json de error
            catch (Exception ex)
            {
                return Json(new { result = false, msg = "Error al intentar guardar los datos" });
            }
        }

        [HttpPost]
        public JsonResult DeleteCategory(int id)
        {
            try
            {
                //Validaciones datos entrada
                var msg = ValidateField(EnumTypes.INT, 0, id);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Id", msg) });

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    MySqlCommand cmd;
                    cmd = new MySqlCommand("DELETE FROM Category WHERE IdCategory = @IdCategory", context.Conexion);
                    cmd.Parameters.AddWithValue("@IdCategory", (object)id);
                    cmd.ExecuteScalar();
                }

                return Json(new { result = true, msg = "Registro eliminado correctamente" });
            }
            //en caso de error regresamos un Json de error
            catch (Exception ex)
            {
                return Json(new { result = false, msg = "Error al eliminar el registro" });
            }
        }

        #endregion

        #region Funciones Product

        [HttpPost]
        public JsonResult GetProduct(int? idProduct, int? idCategory)
        {
            try
            {
                var listModel = new List<ProductModel>();
                MySqlCommand cmd;
                string sql = "SELECT p.*, c.NameCategory FROM Product p INNER JOIN Category c ON c.IdCategory  = p.IdCategory ";
                string where = string.Empty;

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();                    

                    if (idCategory != null && idCategory > 0 && idProduct != null && idProduct > 0)
                    {        
                        where = " WHERE p.IdCategory  = @IdCategory AND p.IdProduct = @IdProduct ";
                        cmd = new MySqlCommand(sql + where, context.Conexion);
                        cmd.Parameters.AddWithValue("@IdCategory", (object)idCategory);
                        cmd.Parameters.AddWithValue("@IdProduct", (object)idProduct);
                    }
                    else if (idCategory == null && idProduct != null && idProduct > 0)
                    {
                        where = " WHERE p.IdProduct = @IdProduct ";
                        cmd = new MySqlCommand(sql + where, context.Conexion);                        
                        cmd.Parameters.AddWithValue("@IdProduct", (object)idProduct);
                    }
                    else if (idCategory != null && idCategory > 0 && idProduct == null)
                    {
                        where = " WHERE p.IdCategory = @IdCategory ";
                        cmd = new MySqlCommand(sql + where, context.Conexion);
                        cmd.Parameters.AddWithValue("@IdCategory", (object)idCategory);                        
                    }
                    else 
                    {
                        cmd = new MySqlCommand(sql, context.Conexion);
                    }

                    MySqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var bussinesModel = "";
                            if (!reader.IsDBNull(4))
                                bussinesModel = reader.GetString(4);
                            
                            listModel.Add(new ProductModel
                            {
                                IdProduct = reader.GetInt32(0),
                                NameProduct = reader.GetString(1),
                                Price = reader.GetDecimal(2),
                                IdCategory = reader.GetInt32(3),
                                BussinessModel = bussinesModel,
                                Code = reader.GetString(5),
                                Stock = reader.GetInt32(6),
                                NameCategory = reader.GetString(7)
                            });
                        }
                    }

                    reader.Close();
                }

                return Json(listModel);
            }
            catch (Exception Ex)
            {
                return Json(new List<CategoryModel>());
            }
        }

        [HttpPost]
        public JsonResult AddProduct(ProductModel model)
        {
            try
            {
                //Validaciones datos entrada
                var msg = ValidateField(EnumTypes.STRING, 250, model.NameProduct);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Nombre", msg) });                

                msg = ValidateField(EnumTypes.STRING, 20, model.Code);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Código", msg) });

                msg = ValidateField(EnumTypes.INT, 0, model.IdCategory);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Categoría", msg) });

                msg = ValidateField(EnumTypes.DECIMAL, 0, model.Price);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Precio", msg) });

                msg = ValidateField(EnumTypes.INT, 0, model.Stock);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Stock", msg) });
                
               
                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    MySqlCommand cmd;
                    var count = 0;

                    //Verificamo si ya existe el producto
                    cmd = new MySqlCommand("SELECT COUNT(*) FROM Product WHERE Code = @Code", context.Conexion);
                    cmd.Parameters.AddWithValue("@Code", (object)model.Code);

                    MySqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows && reader.Read())
                        count = reader.GetInt32(0);

                    reader.Close();

                    if (count > 0)
                        return Json(new { result = false, msg = "Ya existe el producto" });

                    cmd = new MySqlCommand("INSERT INTO Product (NameProduct,Price,IdCategory,Model,Code,Stock) VALUES(@NameProduct,@Price,@IdCategory,@Model,@Code,@Stock)", context.Conexion);
                    cmd.Parameters.AddWithValue("@NameProduct", (object)model.NameProduct);
                    cmd.Parameters.AddWithValue("@Price", (object)model.Price);
                    cmd.Parameters.AddWithValue("@IdCategory", (object)model.IdCategory);
                    cmd.Parameters.AddWithValue("@Model", (object)model.BussinessModel);
                    cmd.Parameters.AddWithValue("@Code", (object)model.Code);
                    cmd.Parameters.AddWithValue("@Stock", (object)model.Stock);                    
                    cmd.ExecuteScalar();
                }

                return Json(new { result = true, msg = "Datos guardados correctamente" });
            }
            //en caso de error regresamos un Json de error
            catch (Exception ex)
            {
                return Json(new { result = false, msg = "Error al intentar guardar los datos" });
            }
        }

        [HttpPost]
        public JsonResult EditProduct(ProductModel model)
        {
            try
            {
                //Validaciones datos entrada
                var msg = ValidateField(EnumTypes.INT, 0, model.IdProduct);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Id", msg) });

                msg = ValidateField(EnumTypes.STRING, 250, model.NameProduct);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Nombre", msg) });

                msg = ValidateField(EnumTypes.STRING, 20, model.Code);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Código", msg) });

                msg = ValidateField(EnumTypes.INT, 0, model.IdCategory);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Categoría", msg) });

                msg = ValidateField(EnumTypes.DECIMAL, 0, model.Price);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Precio", msg) });

                msg = ValidateField(EnumTypes.INT, 0, model.Stock);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Campo Stock", msg) });

                var idProductAux = 0;

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    MySqlCommand cmd;

                    //Verificamo si ya existe el producto
                    cmd = new MySqlCommand("SELECT * FROM Product WHERE Code = @Code LIMIT 1", context.Conexion);
                    cmd.Parameters.AddWithValue("@Code", (object)model.Code);

                    MySqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows && reader.Read())
                        idProductAux = reader.GetInt32(0);

                    reader.Close();

                    if (idProductAux != 0 && idProductAux != model.IdProduct)
                        return Json(new { result = false, msg = "Ya existe el producto" });

                    cmd = new MySqlCommand("UPDATE Product SET NameProduct = @NameProduct,"+
                        "Price = @Price," +
                        "IdCategory = @IdCategory," +
                        "Model = @Model," +
                        "Code = @Code," +
                        "Stock = @Stock" +
                        " WHERE IdProduct = @IdProduct", context.Conexion);
                    cmd.Parameters.AddWithValue("@NameProduct", (object)model.NameProduct);
                    cmd.Parameters.AddWithValue("@Price", (object)model.Price);
                    cmd.Parameters.AddWithValue("@IdCategory", (object)model.IdCategory);
                    cmd.Parameters.AddWithValue("@Model", (object)model.BussinessModel);
                    cmd.Parameters.AddWithValue("@Code", (object)model.Code);
                    cmd.Parameters.AddWithValue("@Stock", (object)model.Stock); 
                    cmd.Parameters.AddWithValue("@IdProduct", (object)model.IdProduct);
                    var result = cmd.ExecuteNonQuery();
                }

                return Json(new { result = true, msg = "Datos guardados correctamente" });
            }
            //en caso de error regresamos un Json de error
            catch (Exception ex)
            {
                return Json(new { result = false, msg = "Error al intentar guardar los datos" });
            }
        }

        [HttpPost]
        public JsonResult DeleteProduct(int id)
        {
            try
            {
                var msg = ValidateField(EnumTypes.INT, 0, id);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : Id", msg) });

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    MySqlCommand cmd;
                    cmd = new MySqlCommand("DELETE FROM Product WHERE IdProduct = @IdProduct", context.Conexion);
                    cmd.Parameters.AddWithValue("@IdProduct", (object)id);
                    cmd.ExecuteScalar();
                }

                return Json(new { result = true, msg = "Registro eliminado correctamente" });
            }
            //en caso de error regresamos un Json de error
            catch (Exception ex)
            {
                return Json(new { result = false, msg = "Error al eliminar el registro" });
            }
        }

        #endregion

        #region Funciones Sales

        [HttpPost]
        public JsonResult GetSales()
        {
            try
            {
                var listModel = new List<SalesModel>();

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    var reader = new MySqlCommand("SELECT * FROM Sales ", context.Conexion).ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            listModel.Add(new SalesModel
                            {
                                IdSales = reader.GetInt32(0),
                                TotalAmount = reader.GetDecimal(1),
                                CreationDate = reader.GetDateTime(2).ToString("dd/MM/yyyy")
                            });
                        }
                    }

                    reader.Close();
                }

                return Json(listModel);
            }
            catch (Exception Ex)
            {
                return Json(new List<CategoryModel>());
            }
        }

        [HttpPost]
        public JsonResult GetSalesLine(int idSales)
        {
            try
            {
                var listModel = new List<SalesLineModel>();
                MySqlCommand cmd;

                using (ContextDB context = new ContextDB())
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    cmd = new MySqlCommand("SELECT sl.Quantity, pr.NameProduct, pr.Code, sl.UnitPrice , sl.Amount "+ 
                                                " FROM Sales sa "+
                                                " INNER JOIN SalesLine sl ON sl.IdSales = sa.IdSales "+
                                                " INNER JOIN Product pr ON pr.IdProduct  = sl.IdProduct "+
                                                " WHERE sl.IdSales  = @IdSales ", context.Conexion);
                    cmd.Parameters.AddWithValue("@IdSales", (object)idSales);

                    MySqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            listModel.Add(new SalesLineModel
                            {
                                Quantity = reader.GetInt32(0),
                                NameProduct = reader.GetString(1),
                                CodeProduct = reader.GetString(2),
                                UnitPrice = reader.GetDecimal(3),
                                Amount = reader.GetDecimal(4)
                            });
                        }
                    }

                    reader.Close();
                }

                return Json(listModel);
            }
            catch (Exception Ex)
            {
                return Json(new List<CategoryModel>());
            }
        }

        [HttpPost]
        public JsonResult AddSales(SalesModel model)
        {
            if (model.ListSalesLine == null || model.ListSalesLine.Count <= 0)
            {
                return Json(new { result = false, msg = "Agregar almenos un producto" });
            }

            var msg = ValidateField(EnumTypes.DECIMAL, 0, model.TotalAmount);
            if (msg != null)
                return Json(new { result = false, msg = string.Format("{0} : El total debe ser mayor a cero", msg) });

            //Validación detalles
            foreach (var item in model.ListSalesLine)
            {
                msg = ValidateField(EnumTypes.INT, 0, item.IdProduct);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : El id del producto no se encuentra", msg) });

                msg = ValidateField(EnumTypes.INT, 0, item.Quantity);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : La cantidad debe ser mayor a cero", msg) });

                msg = ValidateField(EnumTypes.DECIMAL, 0, item.UnitPrice);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : El precio unitario debe ser mayor a cero", msg) });

                msg = ValidateField(EnumTypes.DECIMAL, 0, item.Amount);
                if (msg != null)
                    return Json(new { result = false, msg = string.Format("{0} : El monto de cada linea debe ser mayor a cero", msg) });
            }

            using (ContextDB context = new ContextDB())
            {
                try
                {
                    if (context.Conexion.State == ConnectionState.Closed)
                        context.Conexion.Open();

                    context.StartTransaction();

                    MySqlCommand cmd;

                    cmd = new MySqlCommand("INSERT INTO Sales (TotalAmount) VALUES(@TotalAmount); SELECT LAST_INSERT_ID()", context.Conexion);
                    cmd.Parameters.AddWithValue("@TotalAmount", (object)model.TotalAmount);                        
                    var lastId = cmd.ExecuteScalar();

                    foreach (var item in model.ListSalesLine)
                    {
                        cmd = new MySqlCommand("INSERT INTO SalesLine (IdSales,IdProduct,Quantity,UnitPrice,Amount) VALUES(@IdSales,@IdProduct,@Quantity,@UnitPrice,@Amount)", context.Conexion);
                        cmd.Parameters.AddWithValue("@IdSales", (object)lastId);
                        cmd.Parameters.AddWithValue("@IdProduct", (object)item.IdProduct);
                        cmd.Parameters.AddWithValue("@Quantity", (object)item.Quantity);
                        cmd.Parameters.AddWithValue("@UnitPrice", (object)item.UnitPrice);
                        cmd.Parameters.AddWithValue("@Amount", (object)item.Amount);
                        cmd.ExecuteScalar();                            
                    }

                    context.CommitTransaction();
                    }
                //en caso de error regresamos un Json de error
                catch (Exception ex)
                {
                    context.CancelTransaction();
                    return Json(new { result = false, msg = "Error al intentar guardar los datos" });
                }
            }

            return Json(new { result = true, msg = "Datos guardados correctamente" });           
        }       

        #endregion

        public static string ValidateField(EnumTypes type, int length, object value)
        {
            if (value == null)            
                return "Valor nulo";  

            if (type == EnumTypes.STRING)
            {
                if (length <= 0)
                    return "Si el tipo de dato es string envíar longitud mayor a cero";	
	
                var valueString = value.ToString();
                if (valueString.Length <= 0)               
                    return "Campo requerido";

                if (valueString.Length > length)                
                    return "la cadena supera la longitud del campo";
            }
            else if (type == EnumTypes.INT)
            {
                var valueInt = Convert.ToInt16(value);
                if (valueInt <= 0)                
                    return "El valor debe ser mayor a cero";
            }
            else if (type == EnumTypes.DECIMAL)
            {
                var valueInt = Convert.ToDecimal(value);
                if (valueInt <= 0)                
                    return "El valor debe ser mayor a cero";
            }

            return null;
        }
    }
}
