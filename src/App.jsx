import './App.css'
import {
    Divider,
    Flag,
    Header,
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
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
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

        let showSettings = localStorage.getItem("showSettings");
        if (showSettings == null) {
            showSettings = true;
        } else {
            showSettings = showSettings === true;
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
                showSettings: {english: "Show Settings", tagalog: "I-pakita Ang Settings"},
                hideSettings: {english: "Hide Settings", tagalog: "I-tago Ang Settings"},

                delete: {english: "Delete", tagalog: "Burahin"},
                title: {english: "Product List", tagalog: "Lista Ng Mga Producto"},
                productName: {english: "Product Name", tagalog: "Pangalan Ng Producto"},
                quantity: {english: "Quantity", tagalog: "Bilang"},
                price: {english: "Price", tagalog: "Presyo"},
                total: {english: "Total", tagalog: "Total"},
                addMore: {english: "Add More Product", tagalog: "Magdagdag Ng Producto"}
            },

            showSettings
        }

        this.onChange = this.onChange.bind(this);
    }

    static getDerivedStateFromError(error) {
        console.log(error);
        return {hasError: true}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {language, products, appFontSize, showSettings} = this.state;

        localStorage.setItem("language", language);
        localStorage.setItem("appFontSize", appFontSize);
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("showSettings", showSettings);
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
        const {hasError, products, language, languageMapping, appFontSize, showSettings} = this.state;

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
                            style={{fontSize: appFontSize}}
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
                            style={{fontSize: appFontSize}}
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
                            style={{fontSize: appFontSize}}
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
                            style={{fontSize: appFontSize}}
                        />
                    </TableCell>
                </TableRow>
            })
        }

        let headerStyle = {fontSize: appFontSize, fontWeight: "bold"}

        if (hasError) {
            return (<div>
                <h2>
                    {languageMapping["errorMessage"][language]}
                </h2>
            </div>)
        } else {
            return (<Container fluid style={{padding: "0"}}>
                <Row style={{overflow: "auto", maxWidth: "95vw", maxHeight: "70vh"}}>
                    <Table definition celled padded collapsing unstackable color={'green'} style={{padding: 0}}>
                        <TableHeader fullWidth>
                            <TableRow>
                                <TableHeaderCell textAlign='center' singleLine colSpan={5}>
                                    <span style={headerStyle}>
                                        <Icon name='list'/>
                                        {languageMapping["title"][language]}
                                    </span>
                                </TableHeaderCell>
                            </TableRow>

                            <TableRow>
                                <TableCell width='1'/>
                                <TableCell textAlign='center' width='2'><span
                                    style={headerStyle}>{languageMapping["productName"][language]}</span></TableCell>
                                <TableCell textAlign='center' width='2'><span
                                    style={headerStyle}>{languageMapping["quantity"][language]}</span></TableCell>
                                <TableCell textAlign='center' width='2'><span
                                    style={headerStyle}>{languageMapping["price"][language]} (PHP)</span></TableCell>
                                <TableCell textAlign='center' width='2'><span
                                    style={headerStyle}>{languageMapping["total"][language]}</span></TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {productList}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableHeaderCell colSpan='4' textAlign='right' style={{headerStyle}}>
                                    {languageMapping["total"][language]} (PHP)
                                </TableHeaderCell>
                                <TableHeaderCell colSpan='1' textAlign='center' positive={true} style={{headerStyle}}>
                                    {totalPrice} Pesos
                                </TableHeaderCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Row>

                <Row style={{margin: "10px 0"}}>
                    <Col>
                        <Button
                            variant="success"
                            size='lg'
                            style={{padding: "15px"}}
                            onClick={() => {
                                let newProducts = products.map(v => (v));
                                newProducts.push({name: "", quantity: "", price: ""})

                                this.setState({
                                    products: newProducts
                                })
                            }}>
                        <span style={headerStyle}>
                            <Icon name={'plus'}/>
                            {languageMapping["addMore"][language]}
                        </span>
                        </Button>
                    </Col>

                    <Col>
                        <Button
                            variant="secondary"
                            style={{padding: "15px"}}
                            onClick={() => {
                                this.setState({
                                    showSettings: !showSettings
                                })
                            }}>
                        <span style={headerStyle}>
                            <Icon name={'settings'}/>
                            &nbsp;
                            {showSettings === true
                                ? languageMapping["hideSettings"][language]
                                : languageMapping["showSettings"][language]
                            }
                        </span>
                        </Button>
                    </Col>
                </Row>

                {showSettings && [
                    <Divider/>,

                    <Row style={{marginTop: "10px"}}>
                        <Col>
                            <span style={headerStyle}>
                                {languageMapping["fontSize"][language]}: &nbsp;
                            </span>

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
                        </Col>

                        <Col style={{padding: ".5rem 1rem"}}>
                            <span style={headerStyle}>{languageMapping["language"][language]}: &nbsp;</span>
                            <Switch
                                checkedChildren={<Flag name='ph'/>}
                                unCheckedChildren={<Flag name='us'/>}
                                checked={language === "tagalog"}
                                onChange={() => this.setState({
                                    language: language === "tagalog" ? "english" : "tagalog"
                                })}
                            />
                        </Col>
                    </Row>,

                    <Row style={{
                        marginTop: "15px",
                        paddingBottom: "5px",
                        paddingTop: "5px"
                    }}>
                        <h4>
                            Developed by <a href="https://lordmendoza.com/">Lord Mendoza</a>
                        </h4>
                    </Row>]}
            </Container>)
        }
    }
}

export default App;