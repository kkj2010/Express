import "./Cart.css";

import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { MdQrCode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrderAsync,
  selectCurrentCartItemsExpanded,
  selectCurrentOrderNumber,
  selectDiscountAmount,
  selectSalesTax,
  selectSubTotal,
  selectTotalWithTax,
} from "../../../store/orders";
import { CartItem } from "./CartItem";
import { createRef } from "react";
import { format } from "date-fns";
import { formatPrice } from "../../../utils/formatPrice";
import { useState } from "react";

const TODAY = format(Date.now(), "LLL d yyyy");
const formatOrderNumber = (orderNumber) => {
  if (orderNumber < 10) {
    return `0${orderNumber}`;
  }
  return `${orderNumber}`;
};

export function Cart() {
  const dispatch = useDispatch();
  const currentOrderNumber = useSelector(selectCurrentOrderNumber);
  const currentCartItems = useSelector(selectCurrentCartItemsExpanded);
  const subTotal = useSelector(selectSubTotal);
  const salesTax = useSelector(selectSalesTax);
  const discountedAmount = useSelector(selectDiscountAmount);
  const totalWithTax = useSelector(selectTotalWithTax);

  const scrollRefs = currentCartItems.reduce((prev, curr) => {
    prev[curr.id] = createRef();
    return prev;
  }, {});

  const [paymentType, setPaymentType] = useState(null);

  return (
    <>
      <div className="cart-container">
        <div className="order-detail">
          <div className="order-number">
            Order #{formatOrderNumber(currentOrderNumber)}
          </div>
          <div className="date">{TODAY}</div>
        </div>

        <div className="order-lists-container">
          <div className="item-cards-container">
            {currentCartItems.map((cartItem) => (
              <CartItem
                key={cartItem.id}
                cartItem={cartItem}
                ref={scrollRefs[cartItem.id]}
              />
            ))}
          </div>

          <div className="receipt-container">
            <div className="payment">
              <div className="receipt-text">Receipt</div>
              <div className="payment-text">Payment</div>
            </div>
            <div className="payment-method">
              <div
                className={`payment-debit ${
                  paymentType === "credit" ? "active-payment" : ""
                }`}
                role="button"
                onClick={() => setPaymentType("credit")}
              >
                <div>
                  <BsFillCreditCard2BackFill />
                </div>
                <div>Credit</div>
              </div>
              <div
                className={`payment-cash ${
                  paymentType === "cash" ? "active-payment" : ""
                }`}
                role="button"
                onClick={() => setPaymentType("cash")}
              >
                <div>
                  <RiMoneyDollarCircleFill />
                </div>
                <div>Cash</div>
              </div>
              <div
                className={`payment-code ${
                  paymentType === "code" ? "active-payment" : ""
                }`}
                role="button"
                onClick={() => setPaymentType("code")}
              >
                <div>
                  <MdQrCode />
                </div>
                <div>Code</div>
              </div>
            </div>
            <div className="total-container">
              <div className="sub-total">
                <div>Subtotal</div>
                <div className="amount">{formatPrice(subTotal)}</div>
              </div>
              <div className="sub-total">
                <div>Discount</div>
                <div className="amount">
                  {discountedAmount > 0 ? "-" : ""}
                  {formatPrice(discountedAmount)}
                </div>
              </div>
              <div className="sales-tax">
                <div>Sales tax</div>
                <div className="amount">{formatPrice(salesTax)}</div>
              </div>
            </div>
            <div className="total-text">
              <div>Total</div>
              <div className="amount">{formatPrice(totalWithTax)}</div>
            </div>
            <div>
              <button
                className="order-button"
                onClick={() => {
                  dispatch(createOrderAsync());
                  setPaymentType(null);
                }}
                disabled={currentCartItems.length === 0}
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
