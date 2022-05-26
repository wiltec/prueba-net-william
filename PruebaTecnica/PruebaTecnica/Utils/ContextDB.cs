using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PruebaTecnica.Utils
{
    public class ContextDB : IDisposable
    {
        private MySqlConnection conn;
        private MySqlTransaction trans;
        private bool isTrans;
        private bool disposedValue;

        public MySqlConnection Conexion
        {
            get
            {
                return this.conn;
            }
            set
            {
                this.conn = value;
            }
        }

        public MySqlTransaction Transaccion
        {
            get
            {
                return this.trans;
            }
            set
            {
                this.trans = value;
            }
        }

        public bool IsTransaction
        {
            get
            {
                return this.isTrans;
            }
        }

        public ContextDB()
        {
            this.isTrans = false;
            this.conn = new MySqlConnection(ContextDB.ConnectionString());
            this.isTrans = false;
        }

        public static string ConnectionString()
        {
            string server = ConfigurationManager.AppSettings.Get("SERVER");            
            string port = ConfigurationManager.AppSettings.Get("PORT");
            string database = ConfigurationManager.AppSettings.Get("DATABASE");
            string user = ConfigurationManager.AppSettings.Get("USER");
            string pass = ConfigurationManager.AppSettings.Get("PASSWORD");

            return string.Format("Server={0};Port={1};Database={2};Uid={3};Pwd={4};", server, port, database, user, pass);
        }

        public void StartTransaction()
        {
            try
            {
                if (this.isTrans)
                    return;
                if (this.conn.State == ConnectionState.Closed)
                    this.conn.Open();
                this.trans = this.conn.BeginTransaction();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                this.isTrans = true;
            }
        }

        public bool CommitTransaction()
        {
            bool flag = false;
            try
            {
                if (!this.isTrans)
                    return flag;
                this.trans.Commit();
                return true;
            }
            catch (Exception ex)
            {
                this.trans.Rollback();
                throw new Exception(ex.Message);
            }
            finally
            {
                this.isTrans = false;
                this.trans = (MySqlTransaction)null;
            }
        }

        public bool CancelTransaction()
        {
            bool flag = false;
            try
            {
                if (!this.isTrans)
                    return flag;
                this.trans.Rollback();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                this.isTrans = false;
                this.trans = (MySqlTransaction)null;
            }
        }

        protected virtual void Dispose(bool pDisposing)
        {
            if (!this.disposedValue)
            {
                if (this.conn.State == ConnectionState.Open)
                    this.conn.Close();
                if (this.Transaccion != null)
                    this.Transaccion.Dispose();
                this.conn.Dispose();
            }
            this.disposedValue = true;
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize((object)this);
        }
    }
}