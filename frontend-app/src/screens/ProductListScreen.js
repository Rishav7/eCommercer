import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
	listProducts,
	deleteProduct,
	createProduct,
} from '../actions/productActions'
//to reset the product
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'
const ProductListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1
	const dispatch = useDispatch()

	const productList = useSelector((state) => state.productList)
	const { loading, error, products, page, pages } = productList

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	//get the products success from productdelete state
	const productDelete = useSelector((state) => state.productDelete)
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = productDelete

	const productCreate = useSelector((state) => state.productCreate)
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		product: createdProduct,
	} = productCreate

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET })

		if (!userInfo || !userInfo.isAdmin) {
			history.push('/login')
		}

		if (successCreate) {
			history.push(`/admin/product/${createdProduct._id}/edit`)
		} else {
			dispatch(listProducts('', pageNumber))
		}
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdProduct,
		pageNumber,
	])

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure')) {
			dispatch(deleteProduct(id))
		}
	}

	const createProductHandler = () => {
		console.log('create a new Product from admin')
		dispatch(createProduct())
	}
	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-right'>
					<Button className='my-3' onClick={createProductHandler}>
						Create Product
					</Button>
				</Col>
			</Row>
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}

			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>Image</th>
								<th>ID</th>
								<th>NAME</th>
								<th>Price</th>
								<th>Category</th>
								<th>Brand</th>
							</tr>
						</thead>
						<tbody>
							{products &&
								products.map((product) => (
									<tr key={product._id}>
										<td>
											<Image
												className='p-2 rounded '
												variant='top'
												style={{
													height: '150px',
												}}
												src={product.image}
												alt={product.name}
												fluid
											/>
										</td>

										<td>{product._id}</td>
										<td>{product.name}</td>
										<td>₹{product.price}</td>
										<td>{product.category}</td>
										<td>{product.brand}</td>

										<td>
											<LinkContainer to={`/admin/product/${product._id}/edit`}>
												<Button variant='light' className='btn-sm'>
													<i className='fas fa-edit'></i>
												</Button>
											</LinkContainer>
											<Button
												variant='danger'
												className='btn-sm'
												onClick={() => deleteHandler(product._id)}
											>
												<i className='fas fa-trash'></i>
											</Button>
										</td>
									</tr>
								))}
						</tbody>
					</Table>
					<Paginate page={page} pages={pages} isAdmin={true} />
				</>
			)}
		</>
	)
}

export default ProductListScreen
