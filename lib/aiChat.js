
import axios from "axios"

export async function aiReply(text){
  try{
    const res = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=en`)
    return res.data.success
  }catch{
    return "AI error"
  }
}
