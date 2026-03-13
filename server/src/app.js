import express from 'express';

const app = express();
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/hello',(req,res)=>{
res.json({message:"hello world"})
})
export default app;

