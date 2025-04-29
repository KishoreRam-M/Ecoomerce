package com.krm.Mini.Eccommerce.DTO;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private Integer quantity;
}
