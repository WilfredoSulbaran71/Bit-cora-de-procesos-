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



  router.get('/estado', async (req, res) => {
    try {
        // Listar estados
        const [result] = await pool.query('SELECT * FROM estado');
        res.json({ estados: result });
        console.log(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



//vista para editar datos:
router.get('/edit/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const [registro] = await pool.query('SELECT * , DATE_FORMAT(fecha, "%Y-%m-%d")as fechaFormateada FROM registros WHERE id = ?', [id]);
        const registroEdit = registro[0];
       console.log(registroEdit)
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

/*router.get('/delete/:id', async(req, res)=>{
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
*/
    

router.get('/delete/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM registros WHERE id = ?', [id])
            .catch(error => { console.error(error); });
            res.status(200).json({delete:true});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




//////////Generador de la tabla de datos/////////////////

router.get('/list', async(req, res)=>{
    try{
        const estado = req.query.estado;
        const filtro = estado ? `WHERE estado ='${estado}'`:'';
        // almacenar datos
        const [result] = await pool.query(`SELECT * , DATE_FORMAT(fecha, "%Y-%m-%d")as fechaFormateada FROM registros ${filtro}`);
        console.log(result)
        res.render('registros/list', {registros: result} )
        

        //console.log(result)

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});


/*router.get('/list/filter/:estado', async(req, res)=>{
    try{
        const estado = req.params.estado;
        const filtro = estado ? `WHERE estado ='${estado}'`:'';
        // almacenar datos
        const [result] = await pool.query(`SELECT * , DATE_FORMAT(fecha, "%Y-%m-%d")as fechaFormateada FROM registros ${filtro}`);
        console.log(result)
        res.json({registros: result});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});*/ 

router.post('/list/filter', async(req, res)=>{
    try{
       const estado = req.body.estado;
       const filtro = estado ? `WHERE estado ='${estado}'`:''; 
       const [result] = await pool.query(`SELECT * , DATE_FORMAT(fecha, "%Y-%m-%d")as fechaFormateada FROM registros ${filtro} order by fechaFormateada desc ` );

       res.json({registros: result });

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});








export default router;