using Microsoft.EntityFrameworkCore;
using PortfolioMVC.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioMVC.Data.Business
{
    public abstract class BaseService
    {
        protected PDbContext Context = null!;
        protected void SetContext(PDbContext context)
        {
            Context = context;
        }
        public void AddOrUpdate<T>(T entity) where T : class
        {
            var entry = this.Context.Entry(entity);
            if (this.Context.Entry(entity).State == EntityState.Modified)
                return;
            this.Context.Set<T>().Update(entity);
        }
        public void Remove<T>(T entity) where T : class
        {
            var entry = this.Context.Entry(entity);
            this.Context.Set<T>().Remove(entity);
        }
        public int SaveChanges() => Context.SaveChanges();
        public virtual void Attact<TEntity>(TEntity entity) where TEntity : class
        {
            if (this.Context.Entry(entity).State == EntityState.Detached)
                this.Context.Set<TEntity>().Attach(entity);
        }
        public virtual TEntity? Remove<TEntity>(int id) where TEntity : class
        {
            var set = this.Context.Set<TEntity>();
            var entity = set.Find(id);
            if (entity != null)
            {
                set.Remove(entity);
            }
            return entity;
        }
        public virtual void RemoveRange<TEntity>(IEnumerable<TEntity> entity) where TEntity : class
        {
            var set = this.Context.Set<TEntity>();
             set.RemoveRange(entity);
        }
        public virtual void Add<TEntity>(TEntity entity) where TEntity : class
        {
            var set = this.Context.Set<TEntity>();
            set.Add(entity);
        }
        public virtual void Detach<TEntity>(TEntity entity) where TEntity : class
        {
            var entry = this.Context.Entry(entity);
            if (this.Context.Entry(entity).State != EntityState.Detached)
                entry.State = EntityState.Detached;
        }

    }
}
