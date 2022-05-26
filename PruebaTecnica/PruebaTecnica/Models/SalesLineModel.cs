using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebaTecnica.Models
{
    public class SalesLineModel
    {
        public int IdSalesLine { get; set; }
        public int IdSales { get; set; }
        public int IdProduct { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }

        public string NameProduct { get; set; }
        public string CodeProduct { get; set; }
    }
}