import axios from 'axios';

const fetcherPost = async ({ queryKey }: { queryKey: string },{content}:{content:string}) => {
  const response = await axios.post(queryKey, content,{
    withCredentials: true,
  });
  return response.data;
};

export default fetcherPost;