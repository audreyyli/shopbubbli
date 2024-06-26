import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import ProductList from './ProductList'
import { getProductsByCategory } from '../services/productService'

const ProductCategory = () => {
    const {category} = useParams()
    const [products, setProducts] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [sortType, setSortType] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [hoverIndex, setHoverIndex] = useState(null)
    const [hoverPrev, setHoverPrev] = useState(false)
    const [hoverNext, setHoverNext] = useState(false)
    const itemsPerPage = 10

    useEffect(() => {
        let fetchedProducts = getProductsByCategory(category)

        if (sortType === 'alphabetical-az') {
            fetchedProducts = fetchedProducts.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortType === 'alphabetical-za') {
            fetchedProducts = fetchedProducts.sort((a, b) => b.name.localeCompare(a.name))
        } else if (sortType === 'price-lowhigh') {
            fetchedProducts = fetchedProducts.sort((a, b) => parseFloat(a.price.replace(/\$/g, '')) - parseFloat(b.price.replace(/\$/g, '')))
        } else if (sortType === 'price-highlow') {
            fetchedProducts = fetchedProducts.sort((a, b) => parseFloat(b.price.replace(/\$/g, '')) - parseFloat(a.price.replace(/\$/g, '')))
        }

        const totalItems = fetchedProducts.length
        setTotalPages(Math.ceil(totalItems / itemsPerPage))

        setProducts(fetchedProducts)
    }, [category, sortType])

    const handlePageClick = (page) => {
        setCurrentPage(page)
    }

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1)
    }
    
    const handlePrevPage = () => {
        setCurrentPage(prev => prev > 1 ? prev - 1 : 1)
    }

    return (
        <div>
            <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '30px', marginBottom: '10px', marginTop: '10px'}}>
                <h1 style = {{ fontSize: '28px' }}><b>{category.toUpperCase()}</b></h1>
                <div style = {{ marginRight: '30px' }}>
                    <label htmlFor = "sort"><b>SORT BY |</b></label>
                    <select id = "sort" value = {sortType} onChange = {(e) => setSortType(e.target.value)} style = {{cursor: 'pointer'}}>
                        <option value = "">SELECT</option>
                        <option value = "alphabetical-az">ALPHABETICALLY (A - Z)</option>
                        <option value = "alphabetical-za">ALPHABETICALLY (Z - A)</option>
                        <option value = "price-lowhigh">PRICE (LOW - HIGH)</option>
                        <option value = "price-highlow">PRICE (HIGH - LOW)</option>
                    </select>
                </div>
            </div>
            <div style = {{position: 'relative', marginLeft: '30px'}}>
                    <div style = {{position: 'absolute', width: 'calc(100% - 30px)', height: '2px', backgroundColor: 'black'}}></div>
            </div>
            <div style = {{ marginTop: '30px' }}>
                <ProductList products = {products} />
            </div>
            <div style = {{position: 'relative', marginLeft: '30px'}}>
                    <div style = {{position: 'absolute', width: 'calc(100% - 30px)', height: '1.5px', backgroundColor: 'black'}}></div>
            </div>
            <div style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', margin: '20px 30px'}}>
                <div>
                    {Array.from({length: totalPages}, (_, i) => (
                        <button key = {i} onMouseEnter = {() => setHoverIndex(i)} onMouseLeave = {() => setHoverIndex(null)} onClick = {() => handlePageClick(i + 1)}
                            style = {{
                                width: '30px', 
                                height: '30px', 
                                borderRadius: '50%', 
                                margin: '5px',
                                backgroundColor: currentPage === i + 1 ? 'black' : 'transparent',
                                color: currentPage === i + 1 ? 'white' : hoverIndex === i ? '#BDE6FF' : 'black', 
                                textDecoration: currentPage === i + 1 ? 'none' : (hoverIndex === i ? 'underline' : 'none'),
                                border : 'transparent',
                                display: 'inline-flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                cursor: currentPage === i + 1 ? 'default' : 'pointer'
                            }}>
                                {i + 1}
                            </button>
                    ))}
                </div>
                <div>
                    <button style = {{border: 'transparent', color: hoverPrev ? '#BDE6FF' : 'black', textDecoration: hoverPrev ? 'underline' : 'none'}} onMouseEnter = {() => setHoverPrev(true)} onMouseLeave = {() => setHoverPrev(false)} onClick = {() => handlePrevPage()} disabled = {currentPage === 1}>🡰 <b>PREVIOUS</b></button>
                    <button style = {{border: 'transparent', color: hoverNext ? '#BDE6FF' : 'black', textDecoration: hoverNext ? 'underline' : 'none'}} onMouseEnter = {() => setHoverNext(true)} onMouseLeave = {() => setHoverNext(false)} onClick = {() => handleNextPage()} disabled = {currentPage === totalPages}><b>NEXT</b> 🡲</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCategory