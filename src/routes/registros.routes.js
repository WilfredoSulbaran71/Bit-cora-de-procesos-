import { Router } from "express";
import pool from "../database.js";

const router = Router();




//rutas para cargar la vista de agregar datos

router.get('/add', (req, res)=>{
    res.render('registros/add');
});

//rutas para el envio de los datos

router.post('/add', async(req, res)=>{
    try{
        const {fecha, cliente, solicitante, descripcion, estado, responsable, observaciones} = req.body;
        const newRegistro = {fecha, cliente, solicitante, descripcion, estado, responsable, observaciones};
        //console.log(newRegistro);
        await pool.query('INSERT INTO registros SET ?' , [newRegistro])
        .catch(error => {console.error(error)});      
        res.redirect('/list');
    }

    catch(err){
        
        res.status(500).json({message:err.message});
    }
})


//vista para editar datos:
router.get('/edit/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const [registro] = await pool.query('SELECT * , DATE_FORMAT(fecha, "%Y-%m-%d")as fechaFormateada FROM registros WHERE id = ?', [id]);
        const registroEdit = registro[0];
        res.render('registros/edit', {registro: registroEdit});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})
// Actualizar la vista

router.post('/edit/:id', async(req, res)=>{
    try{
        const {fecha, cliente, solicitante, descripcion, estado, responsable, observaciones} = req.body;
        const {id} = req.params;
        const updateRegistro = {fecha, cliente, solicitante, descripcion, estado, responsable, observaciones}; 
        //console.log(updateRegistro);
        await pool.query('UPDATE registros SET ? WHERE id = ?', [updateRegistro, id],)
        
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});    
    }

    
})

router.get('/delete/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        await pool.query('DELETE FROM registros WHERE id = ?', [id])
        .catch(error => {console.error(error)});
        res.redirect('/list');
    }

    catch(err){
        res.status(500).json({message:err.message});
    }

})


///////////////////////////

router.get('/list', async(req, res)=>{
    try{

        // almacenar datos
        const [result] = await pool.query('SELECT * , DATE_FORMAT(fecha, "%Y-%m-%d")as fechaFormateada FROM registros');
        res.render('registros/list', {registros: result} )
        //console.log(result)

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});




export default router;