projeto-ingressos/
│
├── /node_modules            
├── /src
│   ├── /config
│   │   ├── database.js        
│   ├── /controllers
│   │   ├── authController.js  
│   │   ├── userController.js  
│   │   ├── ingressoController.js 
│   ├── /models
│   │   ├── index.js          
│   │   ├── User.js            
│   │   ├── Ingresso.js        
│   │   ├── Compra.js          <-- Novo arquivo
│   ├── /routes
│   │   ├── authRoutes.js      
│   │   ├── userRoutes.js      
│   │   ├── ingressoRoutes.js  
│   ├── /middlewares
│   │   ├── authMiddleware.js  
│   │   ├── errorHandler.js    
│   ├── /utils
│   │   ├── validators.js      
│   │   ├── logger.js         
│   ├── /views                 
│   └── app.js                 
│
├── .env                   
├── package.json                
├── package-lock.json