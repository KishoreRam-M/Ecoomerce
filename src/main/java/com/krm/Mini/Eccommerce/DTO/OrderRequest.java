package com.krm.Mini.Eccommerce.DTO;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String customerName;
    private String customerEmail;
    private String shippingAddress;
    private String phoneNumber;
    private List<OrderItemRequest> items;
}

