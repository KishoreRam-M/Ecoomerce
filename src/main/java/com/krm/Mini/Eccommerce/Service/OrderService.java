package com.krm.Mini.Eccommerce.Service;

import com.krm.Mini.Eccommerce.Model.Order;
import com.krm.Mini.Eccommerce.Model.OrderItem;
import com.krm.Mini.Eccommerce.Model.Product;
import com.krm.Mini.Eccommerce.Repo.OrderRepo;
import com.krm.Mini.Eccommerce.Repo.ProductRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;

    public OrderService(OrderRepo orderRepo, ProductRepo productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    public List<Order> getOrdersByCustomerEmail(String email) {
        return orderRepo.findByCustomerEmail(email);
    }

    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepo.findByStatus(status);
    }

    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepo.findByCreatedAtBetween(startDate, endDate);
    }

    public Order createdOrder(Order order, List<OrderItem> items) {
        Double totalAmount = 0.0;
        for (OrderItem item : items) {
            Product product = productRepo.findById(item.getProduct().getId()).orElse(() -> new ResourceNotFoundException("Product not found with id :" + item.getId()));
            if (product.getStock() < item.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
            }
            item.setPriceAtPurchase(product.getPrice());
            totalAmount += product.getPrice() * item.getQuantity();
            product.setStock(product.getStock() - item.getQuantity());
            productRepo.save(product);

        }
        order.setTotalAmount(totalAmount);
        Order SavedOrder =orderRepo.save(order);
        for(OrderItem item :items)
        {
            item.setOrder(SavedOrder);
        }
        SavedOrder.setItems(items);
        return  orderRepo.save(SavedOrder);
    }
    @Transactional
    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepo.save(order);
    }

}
