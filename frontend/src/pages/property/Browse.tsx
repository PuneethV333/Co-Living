import { useSearchProperties } from "../../hooks/useProperty"

const Browse = () => {
    const {mutate:data,isPending} = useSearchProperties()
  return (
    <div>Browse</div>
  )
}

export default Browse