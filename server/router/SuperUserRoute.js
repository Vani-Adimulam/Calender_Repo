const express = require ('express');
const SuperUserRoute = express.Router()
const {SuperUserLogin,SuperUserRegister,SuperUserUpdate,SuperUserDelete,SuperUserGetById,} = require('../controller/SuperUserController');

SuperUserRoute.post('/LoginSuperUser', SuperUserLogin);
SuperUserRoute.post('/RegisterSuperUser', SuperUserRegister);
SuperUserRoute.get('/GetSuperUser/:id',SuperUserGetById);
SuperUserRoute.put('/UpdateSuperUser/:id',SuperUserUpdate);
SuperUserRoute.delete('/DeleteSuperUser/:id',SuperUserDelete);

module.exports = SuperUserRoute;