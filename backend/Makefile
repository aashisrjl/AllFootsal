.PHONY: help build up down logs status clean restart build-backend build-users build-futsal build-ml up-backend up-users up-futsal up-ml down-backend down-users down-futsal down-ml logs-backend logs-users logs-futsal logs-ml rebuild clean-all

# Colors for output
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[0;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Directories
BACKEND_DIR := .
USERS_DIR := ../users
FUTSAL_DIR := ../futsal
ML_DIR := ../ml

help:
	@echo "$(BLUE)Futsal Booking System - Docker Compose Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Build:$(NC)"
	@echo "  make build              Build all service images"
	@echo "  make build-backend      Build backend image only"
	@echo "  make build-users        Build users image only"
	@echo "  make build-futsal       Build futsal image only"
	@echo "  make build-ml           Build ML image only"
	@echo ""
	@echo "$(GREEN)Start/Stop:$(NC)"
	@echo "  make up                 Start all services"
	@echo "  make down               Stop all services"
	@echo "  make restart            Restart all services"
	@echo ""
	@echo "$(GREEN)Individual Services:$(NC)"
	@echo "  make up-backend         Start backend only (port 3000)"
	@echo "  make up-users           Start users only (port 3001)"
	@echo "  make up-futsal          Start futsal only (port 3002)"
	@echo "  make up-ml              Start ML only (port 3003)"
	@echo ""
	@echo "  make down-backend       Stop backend"
	@echo "  make down-users         Stop users"
	@echo "  make down-futsal        Stop futsal"
	@echo "  make down-ml            Stop ML"
	@echo ""
	@echo "$(GREEN)Monitoring:$(NC)"
	@echo "  make logs               View logs with -f (all services)"
	@echo "  make logs-backend       View backend logs"
	@echo "  make logs-users         View users logs"
	@echo "  make logs-futsal        View futsal logs"
	@echo "  make logs-ml            View ML logs"
	@echo "  make status             Check all service status"
	@echo ""
	@echo "$(GREEN)Cleanup:$(NC)"
	@echo "  make clean              Stop all services and remove containers"
	@echo "  make clean-all          Full cleanup including images"
	@echo "  make rebuild            Rebuild and start all services"
	@echo ""

# ============================================================================
# Build Commands
# ============================================================================

build:
	@echo "$(YELLOW)Building all service images...$(NC)"
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml \
	                -f $(USERS_DIR)/docker-compose.yml \
	                -f $(FUTSAL_DIR)/docker-compose.yml \
	                -f $(ML_DIR)/docker-compose.yml build
	@echo "$(GREEN)✓ All images built successfully$(NC)"

build-backend:
	@echo "$(YELLOW)Building backend image...$(NC)"
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml build backend
	@echo "$(GREEN)✓ Backend image built$(NC)"

build-users:
	@echo "$(YELLOW)Building users image...$(NC)"
	@docker-compose -f $(USERS_DIR)/docker-compose.yml build users
	@echo "$(GREEN)✓ Users image built$(NC)"

build-futsal:
	@echo "$(YELLOW)Building futsal image...$(NC)"
	@docker-compose -f $(FUTSAL_DIR)/docker-compose.yml build futsal
	@echo "$(GREEN)✓ Futsal image built$(NC)"

build-ml:
	@echo "$(YELLOW)Building ML image...$(NC)"
	@docker-compose -f $(ML_DIR)/docker-compose.yml build ml
	@echo "$(GREEN)✓ ML image built$(NC)"

# ============================================================================
# Start Commands - All Services
# ============================================================================

up:
	@echo "$(BLUE)Starting all services with Docker Compose...$(NC)"
	@echo "$(YELLOW)Backend & Admin on: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Users portal on: http://localhost:3001$(NC)"
	@echo "$(YELLOW)Futsal dashboard on: http://localhost:3002$(NC)"
	@echo "$(YELLOW)ML service on: http://localhost:3003$(NC)"
	@echo ""
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml \
	                -f $(USERS_DIR)/docker-compose.yml \
	                -f $(FUTSAL_DIR)/docker-compose.yml \
	                -f $(ML_DIR)/docker-compose.yml up -d
	@echo "$(GREEN)✓ All services started$(NC)"

down:
	@echo "$(YELLOW)Stopping all services...$(NC)"
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml \
	                -f $(USERS_DIR)/docker-compose.yml \
	                -f $(FUTSAL_DIR)/docker-compose.yml \
	                -f $(ML_DIR)/docker-compose.yml down
	@echo "$(GREEN)✓ All services stopped$(NC)"

restart: down up
	@echo "$(GREEN)✓ All services restarted$(NC)"

# ============================================================================
# Start Commands - Individual Services
# ============================================================================

up-backend:
	@echo "$(BLUE)Starting backend service...$(NC)"
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml up -d backend
	@echo "$(GREEN)✓ Backend started (http://localhost:3000)$(NC)"

up-users:
	@echo "$(BLUE)Starting users service...$(NC)"
	@docker-compose -f $(USERS_DIR)/docker-compose.yml up -d users
	@echo "$(GREEN)✓ Users started (http://localhost:3001)$(NC)"

up-futsal:
	@echo "$(BLUE)Starting futsal service...$(NC)"
	@docker-compose -f $(FUTSAL_DIR)/docker-compose.yml up -d futsal
	@echo "$(GREEN)✓ Futsal started (http://localhost:3002)$(NC)"

up-ml:
	@echo "$(BLUE)Starting ML service...$(NC)"
	@docker-compose -f $(ML_DIR)/docker-compose.yml up -d ml
	@echo "$(GREEN)✓ ML started (http://localhost:3003)$(NC)"

# ============================================================================
# Stop Commands - Individual Services
# ============================================================================

down-backend:
	@echo "$(YELLOW)Stopping backend...$(NC)"
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml down
	@echo "$(GREEN)✓ Backend stopped$(NC)"

down-users:
	@echo "$(YELLOW)Stopping users...$(NC)"
	@docker-compose -f $(USERS_DIR)/docker-compose.yml down
	@echo "$(GREEN)✓ Users stopped$(NC)"

down-futsal:
	@echo "$(YELLOW)Stopping futsal...$(NC)"
	@docker-compose -f $(FUTSAL_DIR)/docker-compose.yml down
	@echo "$(GREEN)✓ Futsal stopped$(NC)"

down-ml:
	@echo "$(YELLOW)Stopping ML...$(NC)"
	@docker-compose -f $(ML_DIR)/docker-compose.yml down
	@echo "$(GREEN)✓ ML stopped$(NC)"

# ============================================================================
# Log Commands
# ============================================================================

logs:
	@echo "$(BLUE)Viewing all service logs...$(NC)"
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml \
	                -f $(USERS_DIR)/docker-compose.yml \
	                -f $(FUTSAL_DIR)/docker-compose.yml \
	                -f $(ML_DIR)/docker-compose.yml logs -f

logs-backend:
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml logs -f backend

logs-users:
	@docker-compose -f $(USERS_DIR)/docker-compose.yml logs -f users

logs-futsal:
	@docker-compose -f $(FUTSAL_DIR)/docker-compose.yml logs -f futsal

logs-ml:
	@docker-compose -f $(ML_DIR)/docker-compose.yml logs -f ml

# ============================================================================
# Status Command
# ============================================================================

status:
	@echo "$(BLUE)Service Status:$(NC)"
	@echo ""
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml \
	                -f $(USERS_DIR)/docker-compose.yml \
	                -f $(FUTSAL_DIR)/docker-compose.yml \
	                -f $(ML_DIR)/docker-compose.yml ps

# ============================================================================
# Cleanup Commands
# ============================================================================

clean:
	@echo "$(YELLOW)Stopping and removing all containers...$(NC)"
	@docker-compose -f $(BACKEND_DIR)/docker-compose.yml \
	                -f $(USERS_DIR)/docker-compose.yml \
	                -f $(FUTSAL_DIR)/docker-compose.yml \
	                -f $(ML_DIR)/docker-compose.yml down 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-all: clean
	@echo "$(YELLOW)Removing all images...$(NC)"
	@docker rmi futsal-backend futsal-users futsal-dashboard futsal-ml 2>/dev/null || true
	@echo "$(GREEN)✓ Full cleanup complete$(NC)"

rebuild: clean build up
	@echo "$(GREEN)✓ Rebuilt and started all services$(NC)"

.DEFAULT_GOAL := help
