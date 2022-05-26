using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebaTecnica.Models
{
    public class ProductModel
    {
        public int IdProduct { get; set; }
        public string NameProduct { get; set; }
        public decimal Price { get; set; }
        public int IdCategory { get; set; }
        public string BussinessModel { get; set; }
        public string Code { get; set; }
        public int Stock { get; set; }

        public string NameCategory { get; set; }
    }
}