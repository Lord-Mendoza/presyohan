import './App.css'
import {
    Flag,
    Header,
    HeaderContent,
    Icon,
    Input,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import React, {Component} from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {Switch} from "antd";

class App extends Component {
    constructor(props) {
        super(props);

        let language = localStorage.getItem("language");
        if (language == null) {
            language = "tagalog";
        }

        let products = localStorage.getItem("products");
        if (products == null) {
            products = [{name: "", quantity: "", price: ""}];
        } else {
            products = JSON.parse(products);
        }

        let appFontSize = localStorage.getItem("appFontSize");
        if (appFontSize == null) {
            appFontSize = 14;
        } else {
            appFontSize = parseInt(appFontSize);
        }

        this.state = {
            language, appFontSize, products,
            hasError: false,
            languageMapping: {
                errorMessage: {
                    english: "Whoops! Something went wrong. Refresh and try again.",
                    tagalog: "Whoops! May nag-kamali. I-refresh ang website at i-try ulit."
                },
                fontSize: {english: "Increase Text Size", tagalog: "Lakihan Ang Sulat"},
                language: {english: "Language", tagalog: "Wika"},

                delete: {english: "Delete", tagalog: "Burahin"},
                title: {english: "Product List", tagalog: "Lista Ng Mga Producto"},
                productName: {english: "Product Name", tagalog: "Pangalan Ng Producto"},
                quantity: {english: "Quantity", tagalog: "Bilang"},
                price: {english: "Price", tagalog: "Presyo"},
                total: {english: "Total", tagalog: "Total"},
                addMore: {english: "Add More Product", tagalog: "Magdagdag Ng Producto"}
            }
        }

        this.onChange = this.onChange.bind(this);
    }

    static getDerivedStateFromError(error) {
        console.log(error);
        return {hasError: true}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {language, products, appFontSize} = this.state;

        localStorage.setItem("language", language);
        localStorage.setItem("appFontSize", appFontSize);
        localStorage.setItem("products", JSON.stringify(products));
    }

    onChange(index, name, value) {
        const {products} = this.state;

        let newProducts = products.map((product, i) => {
            if (i === index)
                return {...product, [name]: value};
            else
                return product;
        })

        this.setState({
            products: newProducts
        })
    }

    render() {
        const {hasError, products, language, languageMapping, appFontSize} = this.state;

        let totalPrice = 0;
        let productList = [];
        if (products != null && Array.isArray(products) && products.length > 0) {
            productList = products.map((product, index) => {
                const {name, quantity, price} = product;

                let total = quantity * price;
                totalPrice += total;

                return <TableRow>
                    <TableCell textAlign="center">
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                let newProductList = products.filter((v, i) => (index !== i));

                                if (newProductList.length < 1) {
                                    newProductList.push({name: "", quantity: "", price: ""});
                                }
                                this.setState({products: newProductList});
                            }}
                            style={{margin: "5px 0"}}
                        >
                            <Icon name="trash alternate" size={"big"}/>
                        </Button>
                    </TableCell>
                    <TableCell textAlign='center'>
                        <Input
                            name={"name"}
                            placeholder={languageMapping["productName"][language]}
                            onChange={(e, {name, value}) => {
                                this.onChange(index, name, value);
                            }}
                            value={name}
                        />
                    </TableCell>

                    <TableCell textAlign='center'>
                        <Input
                            name={"quantity"}
                            placeholder={languageMapping["quantity"][language]}
                            onChange={(e, {name, value}) => {
                                this.onChange(index, name, value);
                            }}
                            value={quantity}
                        />
                    </TableCell>

                    <TableCell textAlign='center'>
                        <Input
                            name={"price"}
                            placeholder={languageMapping["price"][language]}
                            onChange={(e, {name, value}) => {
                                this.onChange(index, name, value);
                            }}
                            value={price}
                        />
                    </TableCell>

                    <TableCell textAlign='center'>
                        <Input
                            name={"total"}
                            placeholder={languageMapping["total"][language]}
                            onChange={(e, {name, value}) => {
                                this.onChange(index, name, value);
                            }}
                            value={total}
                        />
                    </TableCell>
                </TableRow>
            })
        }

        if (hasError) {
            return (<div>
                <h2>
                    {languageMapping["errorMessage"][language]}
                </h2>
            </div>)
        } else {
            return (<div style={{"fontSize": appFontSize + "px"}}>
                <div style={{padding: ".5rem 1rem", float: "left"}}>
                    <span style={{
                        fontSize: "25px",
                        fontWeight: "bold"
                    }}>{languageMapping["fontSize"][language]}: &nbsp;</span>

                    <ButtonGroup style={{paddingBottom: "5px"}}>
                        <Button variant="secondary" onClick={() => {
                            if (appFontSize > 12)
                                this.setState({appFontSize: appFontSize - 1})
                        }}>
                            <Icon name='minus'/>
                        </Button>

                        <Button variant="secondary" onClick={() => {
                            this.setState({appFontSize: appFontSize + 1})
                        }}>
                            <Icon name='plus'/>
                        </Button>
                    </ButtonGroup>
                </div>

                <div style={{padding: ".5rem 1rem", float: "right"}}>
                    <span style={{
                        fontSize: "25px",
                        fontWeight: "bold"
                    }}>{languageMapping["language"][language]}: &nbsp;</span>
                    <Switch
                        checkedChildren={<Flag name='ph'/>}
                        unCheckedChildren={<Flag name='us'/>}
                        checked={language === "tagalog"}
                        onChange={() => this.setState({
                            language: language === "tagalog" ? "english" : "tagalog"
                        })}
                    />
                </div>

                <div>
                    <Table definition celled striped padded color={'green'}>
                        <TableHeader fullWidth>
                            <TableRow>
                                <TableHeaderCell textAlign='center' singleLine colSpan={5}>
                                    <Header>
                                        <Icon name='list'/>
                                        <HeaderContent>
                                            {languageMapping["title"][language]}
                                        </HeaderContent>
                                    </Header>
                                </TableHeaderCell>
                            </TableRow>

                            <TableRow>
                                <TableCell width='1'/>
                                <TableCell textAlign='center' width='3'><Header
                                    as='h3'>{languageMapping["productName"][language]}</Header></TableCell>
                                <TableCell textAlign='center' width='4'><Header
                                    as='h3'>{languageMapping["quantity"][language]}</Header></TableCell>
                                <TableCell textAlign='center' width='4'><Header
                                    as='h3'>{languageMapping["price"][language]} (PHP)</Header></TableCell>
                                <TableCell textAlign='center' width='4'><Header
                                    as='h3'>{languageMapping["total"][language]}</Header></TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {productList}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableHeaderCell colSpan='4' textAlign='right'>
                                    <Header as='h2'>{languageMapping["total"][language]} (PHP)</Header>
                                </TableHeaderCell>
                                <TableHeaderCell colSpan='1' textAlign='center' positive={true}>
                                    <Header as="h2">{totalPrice} Pesos</Header>
                                </TableHeaderCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

                <div style={{padding: "10px"}}>
                    <Button
                        variant="success"
                        size='lg'
                        style={{fontSize: '20pt'}}
                        onClick={() => {
                            let newProducts = products.map(v => (v));
                            newProducts.push({name: "", quantity: "", price: ""})

                            this.setState({
                                products: newProducts
                            })
                        }}>
                        <Icon name={'plus'}/>{languageMapping["addMore"][language]}
                    </Button>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                        float: "right"
                    }}>
                    <h4 style={{color: "black", textAlign: "center"}}>
                        Developed by <a href="https://lordmendoza.com/">Lord Mendoza</a>
                    </h4>
                </div>
            </div>)
        }
    }
}

export default App;