using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebaTecnica.Models
{
    public class SalesModel
    {
        public int IdSales { get; set; }
        public decimal TotalAmount { get; set; }
        public string CreationDate { get; set; }

        public List<SalesLineModel> ListSalesLine { get; set; }
    }
}