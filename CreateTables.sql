CREATE DATABASE pruebawilliam;

#CATEGORÍA
CREATE TABLE Category (
	IdCategory INT AUTO_INCREMENT,
	NameCategory VARCHAR(150) NOT NULL,	
	PRIMARY KEY(IdCategory)
);

#PRODUCTO
CREATE TABLE Product (
    IdProduct INT AUTO_INCREMENT,
    NameProduct VARCHAR(250) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    IdCategory INT NOT NULL,
    Model VARCHAR(80),
    Code VARCHAR(20),
    Stock INT NOT NULL,
    PRIMARY KEY(IdProduct),
    FOREIGN KEY (IdCategory) REFERENCES Category(IdCategory)
);

#VENTAS
CREATE TABLE Sales (
    IdSales INT AUTO_INCREMENT,    
    TotalAmount DECIMAL(10,2) NOT NULL,   
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(IdSales)    
);

#VENTAS DETALLE
CREATE TABLE SalesLine (
    IdSalesLine INT AUTO_INCREMENT,
    IdSales INT NOT NULL,
    IdProduct INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,   
    PRIMARY KEY(IdSalesLine),
    FOREIGN KEY (IdSales) REFERENCES Sales(IdSales),
    FOREIGN KEY (IdProduct) REFERENCES Product(IdProduct)
);