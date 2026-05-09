import { Flex } from "./components/Flex"
import { Sunburst } from "./components/Sunburst"
import { mockData } from "./mock/data"

const App = () => {
	return (
		<Flex className="w-screen h-screen">
			<div className="w-1/2 h-1/2">
				<Sunburst data={mockData} />
			</div>
		</Flex>
	)
}
export default App